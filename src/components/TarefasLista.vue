<template>
  <div>
    <div class="row">
      <div class="col-sm-10">
        <h1 class="font-weight-light">Lista de Tarefas</h1>
      </div>
      <div class="col-sm-2">
        <button
          @click="exibirFormulario = !exibirFormulario"
          class="btn btn-primary float-right"
        >
          <i class="fa fa-plus mr-2"></i>
          <span>Criar</span>
        </button>
      </div>
    </div>

    <ul class="list-group" v-if="tarefas.length > 0">
      <TarefasListaIten
        v-for="tarefa in tarefas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @editar="selecionarTarefa"
      />
    </ul>

    <p v-else>Nenhuma tarefa criada.</p>

    <TarefaSalvar
      v-if="exibirFormulario"
      :tarefa="tarefaSelecionada"
      @criar="criarTarefa"
      @editar="editarTarefa"
    />
  </div>
</template>

<script>
import axios from "axios";

import config from "@/config/config";
import TarefaSalvar from "./TarefaSalvar.vue";
import TarefasListaIten from "./TarefasListaIten.vue";

export default {
  components: {
    TarefaSalvar,
    TarefasListaIten,
  },
  data() {
    return {
      tarefas: [],
      exibirFormulario: false,
      tarefaSelecionada: undefined,
    };
  },
  methods: {
    criarTarefa(tarefa) {
      axios.post(`${config.apiURL}/tarefas`, tarefa)
        .then((r) => {
            this.tarefas.push(r.data);
            this.resetar()
      });
    },
    editarTarefa(tarefa) {
        axios.put(`${config.apiURL}/tarefas/${tarefa.id}`, tarefa)
            .then(r => {
                console.log(r.data)
                // encontrar indice da tarefa 
                const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
                this.tarefas.splice(indice, 1, tarefa)
                this.resetar()
            })
    },
    resetar() {
        this.tarefaSelecionada = undefined
        this.exibirFormulario = false
    },  
    selecionarTarefa(tarefa) {
      this.tarefaSelecionada = tarefa;
      this.exibirFormulario = true;
    },
  },
  created() {
    axios.get(`${config.apiURL}/tarefas`)
        .then((r) => {
            this.tarefas = r.data;
    });
  },
};
</script>
