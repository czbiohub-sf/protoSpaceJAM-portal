![Python version](https://img.shields.io/badge/python-3.9%20%7C%203.10-blue)
![Django-4 1 2](https://img.shields.io/badge/Django-4.1.2-yellow)
![npm-16 17 1](https://img.shields.io/badge/npm-16.17.1-yellowgreen)
![license](https://img.shields.io/badge/license-BSD--3-brightgreen)
![status](https://img.shields.io/badge/status-pre--release-orange)

# Web portal for protoSpaceJAM
![image](https://github.com/czbiohub/protoSpaceJAM-portal/assets/4129442/ae15d063-844b-4906-9381-2c770f5f4a60)




# To deploy a production server, follow the steps below:
### 1. Clone repository
```
git clone https://github.com/czbiohub-sf/protoSpaceJAM-portal
cd protoSpaceJAM-portal
```
### 2. Prepare conda environment
2.1 Install anaconda
```
wget https://repo.anaconda.com/archive/Anaconda3-2022.10-Linux-x86_64.sh
bash Anaconda3-2022.10-Linux-x86_64.sh
```
2.2 Create conda environment and activate it
```
conda env create -f environment.yml
conda activate protoSpaceJAM-portal
```

### 3. Backend
3.1 Install dependencies
protoSpaceJAM
```shell
cd protoSpaceJAM-portal
git clone https://github.com/czbiohub-sf/protoSpaceJAM
cd protoSpaceJAM
pip install .
```
GenoPrimer
```shell
cd .. # go back to folder protoSpaceJAM-portal
git clone https://github.com/czbiohub-sf/genoprimer
pip install pandas==1.3.5 requests==2.27.1 biopython==1.78 primer3_py==0.6.1
```
to install primer3_py (from source) on ubuntu 20.04, the following steps are needed 
```shell
sudo apt update
sudo apt install gcc
sudo apt install build-essential
sudo apt install libffi-dev libssl-dev
```

3.2 Add localhost to ALLOWED_HOSTS in Django settings.py
```
ALLOWED_HOSTS = [   '127.0.0.1:8000',
                    'localhost.localdomain'
                    ]
```

3.3 Start the backend server
```
cd protospaceX_backend
python manage.py runserver
```
### 4. Frontend

4.1 Install nvm, node
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
nvm install 16.17.1
nvm use 16.17.1
```

4.2 Generate html
```
cd ../protospaceX_frontend
npm install 
npm run build
```
4.3 Serve html (with Nginx in this example)   

4.3.0 Install nginx (for example on unbuntu 20.04)
```shell
sudo apt install nginx
sudo ufw allow 'Nginx HTTP' # adjust firewall settings
sudo systemctl status nginx # start nginx service
sudo systemctl enable nginx # enable nginx service on startup
```
4.3.1 Copy the generated html to the web server root directory
```
cp build/* /var/www/html/
```
4.3.2 Redirect `/API_name_PJAM` and `/API_name_genoprimer` to `localhost:8000`