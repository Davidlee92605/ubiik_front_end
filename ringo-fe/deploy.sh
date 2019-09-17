#!/bin/bash
./build-staging.sh
firebase deploy --only hosting --project ubiik-impact --non-interactive
