<template>
  <div>
    <div class="row">
      <div class="col-sm-10">
        <h1 class="font-weight-light">Lista de Tarefas</h1>
      </div>
      <div class="col-sm-2">
        <button
          @click="exibirFormularioCriarTarefa"
          class="btn btn-primary float-right"
        >
          <i class="fa fa-plus mr-2"></i>
          <span>Criar</span>
        </button>
      </div>
    </div>

    <ul class="list-group" v-if="tarefasOrdenadas.length > 0">
      <TarefasListaIten
        v-for="tarefa in tarefasOrdenadas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @editar="selecionarTarefa"
        @deletar="deletarTarefa"
        @concluir="editarTarefa"

      />
    </ul>

    <p v-else-if="!mensagemErro">Nenhuma tarefa criada.</p>

    <div class="alert alert-gander" v-else>{{ mensagemErro }}</div>

    <TarefaSalvar
      v-if="exibirFormulario"
      :tarefa="tarefaSelecionada"
      @criar="criarTarefa"
      @editar="editarTarefa"
    />
  </div>
</template>

<script>
import axios from "@/axios";

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
      tarefaSelecionada : undefined,
    };
  },
  computed: {
    tarefasOrdenadas() {
        return this.tarefas.slice().sort((t1, t2) => {
            if(t1.concluido === t2.concluido) {
                return t1.titulo < t2.titulo 
                    ? -1 
                    : t1.titulo > t2.titulo
                        ? 1
                        : 0  
            }
            return t1.concluido - t2.concluido
        })
    }
  },
  methods: {
    criarTarefa(tarefa) {
      axios.post(`/tarefas`, tarefa)
        .then((r) => {
            this.tarefas.push(r.data);
            this.resetar()
      });
    },
    editarTarefa(tarefa) {
        axios.put(`/tarefas/${tarefa.id}`, tarefa)
            .then(r => {
                console.log(r.data)
                // encontrar indice da tarefa 
                const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
                this.tarefas.splice(indice, 1, tarefa)
                this.resetar()
            })
    },
    deletarTarefa(tarefa) {
        const confirmar = window.confirm(`Deseja deletar a tarefa "${tarefa.titulo}"`)
        if(confirmar) {
            axios.delete(`/tarefas/${tarefa.id}`)
                .then(r => {
                    console.log(r)

                    const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
                    this.tarefas.splice(indice, 1)
                })
        }
    },
    exibirFormularioCriarTarefa() {
        if(this.tarefaSelecionada) {
            this.tarefaSelecionada = undefined
            return
        }
        this.exibirFormulario = !this.exibirFormulario
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
    axios.get(`/tarefas`)
        .then((r) => {
            this.tarefas = r.data;
        }).catch(error =>{
            if (error.response) {
                // Enviei req -> recebi a res <-> res.error [acima do 299]
                this.mensagemErro = `Servidor retornou um erro: 
                    ${error.message} ${error.response.statusText}s`
            } else if(error.request) {
                // montei & enviei server <-> ñ recebo res do server
                this.mensagemErro = `Erro ao tentar comunicar com o servidor:
                    ${error.message}`
            } else {
                // fiz req -> erro ao fzr req
                this.mensagemErro = `Erro ao fazer requisição ao servidor: 
                    ${error.message }`
            }
        })
  },
};
</script>
