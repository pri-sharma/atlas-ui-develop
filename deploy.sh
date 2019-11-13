#!/bin/bash

# Prerequisites
sudo apt-get update && sudo apt-get -y install gpg curl lsb-release python python-dev
export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)"
echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
sudo apt-get update && sudo apt-get -y install google-cloud-sdk google-cloud-sdk-app-engine-python google-cloud-sdk-app-engine-python-extras google-cloud-sdk-cloud-build-local

# Decrypt the service account file
export gpg='.gpg'
export enc_svc_acct_key="$serviceaccount$gpg"
gpg --pinentry-mode=loopback --passphrase $DECRYPTION_KEY -o $serviceaccount -d $enc_svc_acct_key

# Build the app
# apt-get -y install npm
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential

sudo npm install react-scripts -g
npm install --only=prod

if [ -z "$NETWORK_NAME" ]
then
    echo "Network empty"
else
    echo "network:" >> app.yaml
    echo "  name: $NETWORK_NAME" >> app.yaml
fi

if ! npm run build; then
    return 1;
fi

sudo cp serve.json ./build

sudo -E gcloud auth activate-service-account --key-file=$serviceaccount

# npm test

# Activate the service account file
sudo -E gcloud config set project $project

sudo -E gcloud app deploy --quiet --promote