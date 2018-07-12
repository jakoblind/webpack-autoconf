#!/bin/bash

cd generated
mkdir zips

ls | xargs -I % zip -r zips/%.zip %

aws s3 --profile jakob sync zips s3://jakoblind/zips
cd -
