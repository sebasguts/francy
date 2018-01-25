FROM sebasguts/gapbinder:20180132

MAINTAINER Manuel Martins <manuelmachadomartins@gmail.com>

COPY . /home/gap/francy

# install francy js on jupyter
USER root

RUN jupyter nbextension install /home/gap/francy/js/dist/francy --system
RUN jupyter nbextension enable francy/jupyter/main --system
RUN chown -R gap /home/gap/francy/ \
 && chgrp -R gap /home/gap/francy/
RUN mv /home/gap/francy/gap /home/gap/inst/gap/pkg/francy

USER gap



# read write permissions for notebooks, easier to change and save!

