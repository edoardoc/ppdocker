--------------------------------
export WHICH_COMMIT=f7ed7e1a3811
sh ./update.sh
docker build --build-arg WHICH_COMMIT=${WHICH_COMMIT} -t java-app .
docker run -e WHICH_COMMIT=${WHICH_COMMIT} -it java-app sh mediavacanze.sh dbpp ./pp.json