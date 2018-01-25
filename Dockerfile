FROM sebasguts/gapbinder:20180132

MAINTAINER Manuel Martins <manuelmachadomartins@gmail.com>

USER root

RUN git clone https://github.com/mcmartins/francy.git
RUN jupyter nbextension install francy/js/dist/francy --system
RUN jupyter nbextension enable francy/jupyter/main --system
RUN mv francy/gap /home/gap/inst/gap-master/pkg/francy

COPY . /home/gap
