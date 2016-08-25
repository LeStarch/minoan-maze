#!/bin/bash

while (( 1 ))
do
  ./generate > mazes/maze-`date +%Y-%m-%dT%H:%M:%S.%N`.txt
done
