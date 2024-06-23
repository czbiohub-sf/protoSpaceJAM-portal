import pickle
import pandas as pd
import subprocess as s
import os
import sys

import argparse
class MyParser(argparse.ArgumentParser):
    def error(self, message):
        sys.stderr.write('error: %s\n' % message)
        self.print_help()
        sys.exit(2)

def parse_args():
    parser= MyParser(description='ProtospaceX')
    parser.add_argument('--jobID', default="", type=str)
    config = parser.parse_args()
    return config

config = vars(parse_args())
jobID = config["jobID"]

protospacexCLI_dir = "protoSpaceJAM/protoSpaceJAM"

#job directory
jobDir = os.path.join(protospacexCLI_dir,"jobs",jobID)
if not os.path.exists(jobDir):
    os.makedirs(jobDir)

#read input.csv (from views.py)
df = pd.read_csv(os.path.join(jobDir,"input.csv"), keep_default_na=False)

#make a new column to group similar job configs (that can run in the same protospacex batch)
if "EnforceMaxDonLen" in df.columns:
    df["commonConfig"] = df["Genome"].astype(str) + "_" + df["numOfgRNA"].astype(str) + "_" + df["Nuclease"] + "_" + df["HAarmLen"].astype(str) + "_"  + df["EnforceMaxDonLen"].astype(str) + "_" \
        + df["MaxDonLen"].astype(str) + "_" + df["recodeIntensity"].astype(str) + "_" + df["cfdThres"].astype(str) + "_" \
        + df["Payload"].astype(str) + "_"  + df["NtermPayload"].astype(str) + "_" + df["CtermPayload"].astype(str) + "_" + df["PosPayload"].astype(str) + "_"\
        + df["strandChoice"].astype(str) + "_" + df["CustomSeq2Avoid"].astype(str) + "_" + df["mutateOrder"].astype(str) + df["MinArmLenPostTrim"].astype(str)  + df["penalizeReg"].astype(str) + "_" \
        + df["SpecificityWeightScalingFactor"].astype(str) + "_" + df["Cut2InsertDistWeightScalingFactor"].astype(str)  + "_" +  df["PositionWeightScalingFactor"].astype(str) + "_" + df["RecodeOnlyInCodingRegion"].astype(str) 
else:
    df["commonConfig"] = df["Genome"].astype(str) + "_" + df["numOfgRNA"].astype(str) + "_" + df["Nuclease"] + "_" + df["HAarmLen"].astype(str) + "_" \
        + df["MaxDonLen"].astype(str) + "_" + df["recodeIntensity"].astype(str) + "_" + df["cfdThres"].astype(str) + "_" \
        + df["Payload"].astype(str) + "_"  + df["NtermPayload"].astype(str) + "_" + df["CtermPayload"].astype(str) + "_" + df["PosPayload"].astype(str) + "_" \
        + df["strandChoice"].astype(str) + "_" + df["CustomSeq2Avoid"].astype(str) + "_" + df["mutateOrder"].astype(str) + df["MinArmLenPostTrim"].astype(str)  + df["penalizeReg"].astype(str) + "_" \
        + df["SpecificityWeightScalingFactor"].astype(str) + "_" + df["Cut2InsertDistWeightScalingFactor"].astype(str)  + "_" +  df["PositionWeightScalingFactor"].astype(str) + "_" + df["RecodeOnlyInCodingRegion"].astype(str)
    
#make master res csv file (to collect results from protospacex batches)
masterOutCsv = open(os.path.join(jobDir,"result.csv"), 'w')
masterOutCsv.write("Entry #,Ensembl_ID,chr,transcript_type,name,terminus,gRNA_name,gRNA_seq,PAM,gRNA_start,gRNA_end,gRNA_cut_pos,edit_pos,distance_between_cut_and_edit(cut_pos-insert_pos),specificity_score,specificity_weight,distance_weight,position_weight,final_weight,cfd_before_recoding,cfd_after_recoding,cfd_after_windowScan_and_recoding,max_recut_cfd,donor_name,donor,trimmed_donor_name,trimmed_donor,effective_HA_len,synthesis_problems,cutPos2nearestOffLimitJunc,strand(gene/gRNA/donor)\n")

#make master res csv file (to collect results from protospacex batches)
GenoPrimerInCsv = open(os.path.join(jobDir,"GenoPrimerIn.csv"), 'w')
GenoPrimerInCsv.write(f"Entry,ref,chr,coordinate,ID,geneSymbol\n")

logs=open("wrapper_stdout_protospaceX.txt", "w")

#loop through all unique conf batches
configID=0
for conf in list(set(df["commonConfig"])):
    tmpdf = df[df["commonConfig"] ==conf]
    #print(conf)
    #print(tmpdf)
    #make directory for current conf
    outdir = os.path.join(jobDir, f"configID_{configID}")
    if not os.path.exists(outdir):
        os.makedirs(outdir)
    #write input.csv
    inputfile = os.path.join(outdir,"input.csv")
    with open(inputfile, "w") as w:
        w.write("Entry,Ensembl_ID,Target_terminus,Chromosome,Coordinate\n") # header
        for index, row in tmpdf.iterrows():  #write genes in this conf batche
            w.write(f"{row['Entry #']},{row.Ensembl_ID},{row.Terminus},{row.Chromosome},{row.Coordinate}\n")
    #generate protospacex command
    
    outdir2 = os.path.join("jobs",jobID, f"configID_{configID}") # removed leading "protospaceX_CLI", b/c the wd is in protospaceX_CLI
    cmd = [f"protoSpaceJAM", "--outdir",  outdir2, "--path2csv", os.path.join(outdir2,"input.csv"), "--num_gRNA_per_design", str(tmpdf["numOfgRNA"].iloc[0]), "--HA_len", str(tmpdf["HAarmLen"].iloc[0]), "--genome_ver", tmpdf["Genome"].iloc[0], "--cfdThres", str(tmpdf["cfdThres"].iloc[0]) ]

    #payload, NOTE: payload will override Npayload and Cpayload
    if tmpdf["Payload"].iloc[0] != "":
        cmd = cmd + ["--payload", tmpdf["Payload"].iloc[0]]
    if tmpdf["NtermPayload"].iloc[0] != "":
        cmd = cmd + ["--Npayload", tmpdf["NtermPayload"].iloc[0]]
    if tmpdf["CtermPayload"].iloc[0] != "":
        cmd = cmd + ["--Cpayload", tmpdf["CtermPayload"].iloc[0]]
    if tmpdf["PosPayload"].iloc[0] != "":
        cmd = cmd + ["--POSpayload", tmpdf["PosPayload"].iloc[0]]

    #recode intensity
    if tmpdf["recodeIntensity"].iloc[0] == "full":
        cmd = cmd + ["--recoding_full"]
    if tmpdf["recodeIntensity"].iloc[0] == "stop_recut_only":
        cmd = cmd + ["--recoding_stop_recut_only"]
    if tmpdf["recodeIntensity"].iloc[0] == "off":
        cmd = cmd + ["--recoding_off"]

    #enforce max donor length
    if "EnforceMaxDonLen" in tmpdf.columns:
        if tmpdf["EnforceMaxDonLen"].iloc[0] != False and tmpdf["MaxDonLen"].iloc[0] != "N/A": 
            cmd = cmd + ["--ssODN_max_size", str(tmpdf["MaxDonLen"].iloc[0])]
    else:
        if "MaxDonLen" in tmpdf.columns:
            if tmpdf["MaxDonLen"].iloc[0] != "N/A":
                cmd = cmd + ["--ssODN_max_size", str(tmpdf["MaxDonLen"].iloc[0])]

    #print(tmpdf.columns)
    if tmpdf["DonorSSDS"].iloc[0] != "":
        cmd = cmd + ["--Donor_type", str(tmpdf["DonorSSDS"].iloc[0])]

    if tmpdf["strandChoice"].iloc[0] != "":
        cmd = cmd + ["--Strand_choice", str(tmpdf["strandChoice"].iloc[0])]

    if len(str(tmpdf["SelectedEnzymes"].iloc[0])) > 0:
        cmd = cmd + ["--CheckEnzymes", str(tmpdf["SelectedEnzymes"].iloc[0])]

    if len(str(tmpdf["CustomSeq2Avoid"].iloc[0])) > 0:
        CustomSeq2Avoid = str(tmpdf["CustomSeq2Avoid"].iloc[0])
        CustomSeq2Avoid = CustomSeq2Avoid.replace(",", "|")
        cmd = cmd + ["--CustomSeq2Avoid", CustomSeq2Avoid]

    if len(str(tmpdf["mutateOrder"].iloc[0])) > 0:
        mutateOrder = str(tmpdf["mutateOrder"].iloc[0])
        if not mutateOrder in ["protospacer_first", "PAM_first"]:
            mutateOrder = "PAM_first"
        cmd = cmd + ["--recode_order", mutateOrder]

    if len(str(tmpdf["MinArmLenPostTrim"].iloc[0])) > 0: # don't need the to check donor type, b/c pJAM will only trim if the donor is dsDNA
        MinArmLenPostTrim = str(tmpdf["MinArmLenPostTrim"].iloc[0])
        if MinArmLenPostTrim.isnumeric() and int(MinArmLenPostTrim) >= 0:
            cmd = cmd + ["--MinArmLenPostTrim", MinArmLenPostTrim]
        else:
            MinArmLenPostTrim = "0"

    if not tmpdf["penalizeReg"].iloc[0] == True:
        cmd = cmd + ["--no_regulatory_penalty"]

    if tmpdf["Nuclease"].iloc[0] == "Cas9":
        cmd = cmd + ["--pam", "NGG"]
    if tmpdf["Nuclease"].iloc[0] == "SpCas9-VQR":
        cmd = cmd + ["--pam", "NGA"]
    if tmpdf["Nuclease"].iloc[0] == "enAsCas12a":
        cmd = cmd + ["--pam", "TTTV"]

    if tmpdf["SpecificityWeightScalingFactor"].iloc[0] != "":
        cmd = cmd + ["--alpha1", str(tmpdf["SpecificityWeightScalingFactor"].iloc[0])]
    if tmpdf["Cut2InsertDistWeightScalingFactor"].iloc[0] != "":
        cmd = cmd + ["--alpha2", str(tmpdf["Cut2InsertDistWeightScalingFactor"].iloc[0])]
    if tmpdf["PositionWeightScalingFactor"].iloc[0] != "":
        cmd = cmd + ["--alpha3", str(tmpdf["PositionWeightScalingFactor"].iloc[0])]

    if tmpdf["RecodeOnlyInCodingRegion"].iloc[0] == True:
        cmd = cmd + ["--recoding_coding_region_only"]

    

    #run protospaceX
    #print(" ".join(cmd))
    p = s.Popen(cmd, universal_newlines=True, stdout=s.PIPE, stderr=s.STDOUT, cwd=protospacexCLI_dir)
    mystdout = p.stdout.read()
    p.communicate()  # now wait for the process to finish

    #read result write to the master result file,

    tmpdf = tmpdf.reset_index() #reset index so the index starts with 0
    with open(os.path.join(outdir,"result.csv"),'r') as f:
        next(f) #skip header
        for line in f:
            #print(i)
            masterOutCsv.write(f"{line}")

    #read GenomePrimer input file and write to the consolidated file
    tmpdf = tmpdf.reset_index() #reset index so the index starts with 0
    with open(os.path.join(outdir,"input_for_GenoPrimer.csv"),'r') as f:
        next(f) #skip header
        for line in f:
            #print(i)
            GenoPrimerInCsv.write(f"{line}")


    logs.write("\ncmd:")
    logs.write(" ".join(cmd))
    logs.write("\n")
    logs.write(mystdout)

    #misc work before next loop
    configID+=1

masterOutCsv.close()

#sort master out csv by Entry #
masterdf = pd.read_csv(os.path.join(jobDir,"result.csv"),index_col=None)
sorted_masterdf = masterdf.sort_values(by=["Entry #"], ascending=True)
sorted_masterdf.to_csv(os.path.join(jobDir,"result.sorted.csv"), index=False)

#print("Done with ProtospaceX wrapper execution")