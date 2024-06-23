from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
#from .serializers import NoteSerializer
#from .models import Notes
import subprocess as s
import os
import pandas as pd
import pickle
# import logging
from datetime import datetime
import random
import zipfile
import base64

# logger = logging.getLogger(__name__)
# logging.basicConfig()
# logging.getLogger().setLevel(logging.DEBUG)

@api_view(['GET', 'POST'])
def protospacex(request):
    if request.method == 'POST':

        data = request.data
        df = pd.DataFrame.from_dict(data)
        #keys in data:
        #gRNAnum': '1', 'HAlen': '500', 'payload': 'mNG11', 'recodeMode': 'full', 'EnforceMaxDonLen': False, 'Genome': 'GRCh38', 'MaxDonLen': '200'
        
        timestamp =  datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
        rnd_num = str(int(random.random()*1000))
        jobID = timestamp + "_r" + rnd_num

        protospacexCLI_dir = "protoSpaceJAM/protoSpaceJAM"

        #write input file
        outdir = os.path.join(protospacexCLI_dir,"jobs",jobID)
        if not os.path.exists(outdir):
            os.makedirs(outdir)
        inputfile = os.path.join(outdir,"input.csv")
        #put the last column as the first column
        cols = df.columns.tolist()
        cols = cols[-1:] + cols[:-1]
        df = df[cols]
        df.rename(columns={"ID": "Ensembl_ID"}, inplace=True)
        df.rename(columns={"EntryNum": "Entry #"}, inplace=True)
        df.to_csv(inputfile, index=False)

        cmd = [f"python", "protospaceX_CLI_wrapper.py", "--jobID", jobID]
        p = s.Popen(cmd, universal_newlines=True, stdout=s.PIPE, stderr=s.STDOUT)
        mystdout = p.stdout.read()
        p.communicate()  # now wait for the process to finish
        print(mystdout)

        jobdir_path = os.path.join(protospacexCLI_dir,"jobs",jobID)

        #read output
        with open(os.path.join(jobdir_path,"result.sorted.csv"), 'r') as f:
                result = f.read()
        #read input
        with open(os.path.join(jobdir_path,"input.csv"), 'r') as f:
                inputs = f.read()
        #read GenoPrimer input
        GenoPrimerInputfile = os.path.join(jobdir_path,"GenoPrimerIn.csv")
        GenoPrimerInput_df = pd.read_csv(GenoPrimerInputfile)

        #read genbank files
        genbank_files_content = []
        config_subdirs = [] # find all config subdirs
        zipf = zipfile.ZipFile(os.path.join(jobdir_path, "genbank_files.zip"), 'w') 
        with os.scandir(jobdir_path) as entries:
            for entry in entries:
                if entry.is_dir() and "configID_" in entry.name:
                    config_subdirs.append(entry.name)
        for config_subdir in config_subdirs: # for each config subdir, find all genbank files
            for file_name in os.listdir(os.path.join(jobdir_path, config_subdir, "genbank_files")):
                if file_name.endswith(".gb"):
                    file_path = os.path.join(jobdir_path, config_subdir, "genbank_files", file_name)
                    with open(file_path, "r", encoding='utf-8') as file: # read genbank file and add to list
                        content = file.read()
                        genbank_files_content.append({
                            'filename': file_name,
                            'content': content
                        })
                    zipf.write(file_path, arcname=file_name) # add genbank file to zip
        zipf.close()

        # read zip file
        with open(os.path.join(jobdir_path, "genbank_files.zip"), "rb") as f:
            binary_data = f.read()
            b64_encoded_zip_file = base64.b64encode(binary_data).decode('utf-8')

        return Response([result,inputs,jobID,GenoPrimerInput_df, genbank_files_content, b64_encoded_zip_file])
    else:
        return Response("",status=500)


def closest_val(lst, K):
    return lst[min(range(len(lst)), key = lambda i: abs(lst[i]-K))]

def closest_idx(lst, K):
    return min(range(len(lst)), key = lambda i: abs(lst[i]-K))


@api_view(['GET', 'POST'])
def genoprimer(request):
    if request.method == 'POST':
        logs=open("views_stdout_GenoPrimer.txt", "w")
        data = request.data
        jobID = data["JobID"]
        PrimerMode = data["PrimerMode"]
        Entry = str(data["Entry"])
        Chr = str(data["chr"])
        Coordinate = str(data["coordinate"])
        Ref = data["ref"] 
        ID = data["ID"]
        GeneSymbol = data["geneSymbol"]
        TunePrimers = data["TunePrimers"]
        PrimerOptions = data["PrimerOptions"]
        CheckPrecomputed = data["CheckPrecomputed"]

        logs.write(f"{data}\n{PrimerMode},{Entry},{Ref},{Chr},{Coordinate}\n")
        logs.write(f"{TunePrimers}\n{PrimerOptions}\n")


        ##########################code to run GenoPrimer in realtime##########################
        #write input file
        outdir = os.path.join("GenoPrimer_CLI","jobs",jobID,Entry)
        if not os.path.exists(outdir):
            os.makedirs(outdir)
        inputfile = os.path.join(outdir,"input.csv")
        with open(inputfile,"w") as f:
            f.write(f"Entry,ref,chr,coordinate,ID,geneSymbol\n")
            f.write(f"{Entry},{Ref},{Chr},{Coordinate},{ID},{GeneSymbol}\n")

        #run GenoPrimer
        cmd = [f"python", "GenoPrimer.py", "--csv", os.path.join("jobs", jobID, Entry,"input.csv"), "--outdir", os.path.join("jobs", jobID, Entry), "--thread", "4",
               "--type", PrimerMode]
        if TunePrimers:
            cmd = cmd + ["--prod_size_lower", str(PrimerOptions["prod_size_lower"]), "--prod_size_upper", str(PrimerOptions["prod_size_upper"]),
                         "--min_tm", str(PrimerOptions["Tm_lower"]), "--max_tm", str(PrimerOptions["Tm_upper"]), "--opt_tm", str(PrimerOptions["Tm_opt"])]
        if CheckPrecomputed:
            cmd = cmd + ["--check_precomputed"]
                         
        #print(cmd)
        #run Genoprimer
        GenoPrimerCLI_dir = "GenoPrimer_CLI"
        p = s.Popen(cmd, universal_newlines=True, stdout=s.PIPE, stderr=s.STDOUT, cwd=GenoPrimerCLI_dir)
        mystdout = p.stdout.read()
        p.communicate()  # now wait for the process to finish

        logs.write("\n")
        logs.write(" ".join(cmd))
        logs.write("\n")
        logs.write(mystdout)

        #process result (the output file has one line of result)
        if CheckPrecomputed:
            with open(os.path.join(GenoPrimerCLI_dir,"jobs", jobID, Entry,"out_precomputed.csv"), 'r') as f:
                header = f.readline()
                result = f.readline()
                if "precomputed primers exists" in result:
                    result = True
                else:
                    result = False
        else:
            with open(os.path.join(GenoPrimerCLI_dir,"jobs", jobID, Entry,"out.csv"), 'r') as f:
                header = f.readline()
                result = f.readline()
            #result = f"{Entry},{result}" #add entry number to the precomputed results
        ############################End of code to run GenoPrimer in realtime#################

        ############################fetch primers from precomputed results############################
        # result=""
        # Genome = Ref
        # result_by_chr_dir = os.path.join("precomputed_primers",PrimerMode,f"ensembl_{Genome}_latest",Chr)
        # if os.path.isdir(result_by_chr_dir):
        #     list_of_locsDIR = os.listdir(result_by_chr_dir)
        #     list_of_locs = [int(i.split("_")[0]) for i in list_of_locsDIR]
        #     res_dir = list_of_locsDIR[closest_idx(list_of_locs,int(Coordinate))]
        #     res_file = os.path.join(result_by_chr_dir, res_dir, "out.csv")
        #     if os.path.isfile(res_file):
        #         with open(res_file, 'r') as f:
        #             header = f.readline()
        #             result = f.readline()
        # 
        # result = f"{Entry},{result}" #add entry number to the precomputed results
        ###########################################################################################

        return Response(result)
    else:
        return Response("",status=500)
