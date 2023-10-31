#!/bin/bash
git add .
git commit -m 'patch ready'
npm version patch
git push
