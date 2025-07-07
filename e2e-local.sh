#!/bin/sh

cd $(dirname $0)

# this is to stop MSys (Git bash on Windows) from messing with the paths
export MSYS_NO_PATHCONV=1

# Keep image version in sync with image used in .gitlab-ci.yml
PLAYWRIGHT_IMAGE="mcr.microsoft.com/playwright:v1.53.2-jammy"
OS=$(uname -s)
CWD=$(pwd)

if [ x"$DOCKER" = "x" ]; then
  DOCKER=docker
fi

case "$DOCKER" in
  *podman*)
    BRIDGE_ADDRESS=host.containers.internal
    ;;
  *)
    BRIDGE_ADDRESS=host.docker.internal
    ;;
esac

if command -v getenforce &> /dev/null && [ "$(getenforce)" = "Enforcing" ]; then
  MOUNT_FLAGS=",Z"
fi

LOCAL_ADDRESS=$BRIDGE_ADDRESS
NETWORK_MODE=bridge
DISPLAY=$LOCAL_ADDRESS:0

case "$OS" in
  Linux*)
    LOCAL_ADDRESS=localhost
    NETWORK_MODE=host
    DISPLAY=$DISPLAY
    ;;
  MINGW*)
    CWD=$(cygpath -w $CWD)
    ;;
esac

if [ x$PORT = "x" ]; then
  PORT=4200
fi

echo "Using '$DOCKER' in '$NETWORK_MODE' mode, connecting to '$LOCAL_ADDRESS:$PORT'"


if [ x$1 = "xshell" ]; then
  shift
  $DOCKER run -it --rm \
    -e DISPLAY=$DISPLAY \
    -e LOCAL_ADDRESS=$LOCAL_ADDRESS \
    -e PORT=$PORT \
    -e PLAYWRIGHT_CONTAINER=true \
    -e PLAYWRIGHT_isvrt=true \
    -e PLAYWRIGHT_staticTest=$PLAYWRIGHT_staticTest \
    -v $CWD:/e2e:rw$MOUNT_FLAGS \
    -w /e2e \
    --net=$NETWORK_MODE \
    --ipc=host \
    --entrypoint bash \
    $PLAYWRIGHT_IMAGE \
    "$@"

else
  if [ x$1 = "xrun" ]; then
    shift
  fi
  if [ x$1 = "xvrt" ]; then
    shift
    PLAYWRIGHT_isvrt=true
  fi
  if [ x$1 = "xa11y" ]; then
    shift
    PLAYWRIGHT_isa11y=true
  fi
  if [ x$1 = "xupdate" ]; then
    shift
    # using env var so the user can pass a --env
    UPDATE_ARGS="--update-snapshots"
    PLAYWRIGHT_isvrt=true
  fi
  $DOCKER run -it --rm \
    -e LOCAL_ADDRESS=$LOCAL_ADDRESS \
    -e PORT=$PORT \
    -e PLAYWRIGHT_CONTAINER=true \
    -e PLAYWRIGHT_isa11y=$PLAYWRIGHT_isa11y \
    -e PLAYWRIGHT_isvrt=$PLAYWRIGHT_isvrt \
    -e PLAYWRIGHT_staticTest=$PLAYWRIGHT_staticTest \
    -v $CWD:/e2e:rw$MOUNT_FLAGS \
    -w /e2e \
    --net=$NETWORK_MODE \
    --ipc=host \
    $PLAYWRIGHT_IMAGE \
    npx \
    playwright \
    test \
    $UPDATE_ARGS \
    "$@" \
  || yarn playwright show-report playwright/results/preview
fi
