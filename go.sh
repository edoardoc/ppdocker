#!/bin/bash

# settaggi per test ppappsrv01
export IP_GESTIONALE=194.242.228.82
export IP_DBA1=194.242.228.33
export IP_DBA2=194.242.228.33

docker-compose build
docker-compose up
