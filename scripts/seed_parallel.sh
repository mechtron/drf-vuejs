#!/bin/bash

# Optional parameter to specify degree of parallelism
DOP=${1:-10}

for ((n=0; n<DOP; n++))
do
    python3 seed.py &
done

wait
