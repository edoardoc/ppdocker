#!/bin/bash
cat > /pg/data/postgresql.conf <<EOS
# Generated by fix-pgconf.sh
listen_addresses = '*'
datestyle = 'iso, mdy'
standard_conforming_strings = off
EOS
