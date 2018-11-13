--------------------------------
export WHICH_COMMIT=eab39677d76a
sh ./update.sh
docker build --build-arg WHICH_COMMIT=${WHICH_COMMIT} -t java-app .
docker run -e WHICH_COMMIT=${WHICH_COMMIT} -it java-app sh mediavacanze.sh