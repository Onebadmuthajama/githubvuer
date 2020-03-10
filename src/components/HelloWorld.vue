<template>
  <v-container class="d-flex flex-column justify-start col-12">
    <v-form class="col-4" ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="owner"
        :rules="inputRules"
        label="Repository Owner"
        required
      ></v-text-field>

      <v-text-field
        v-model="name"
        :rules="inputRules"
        label="Repository Name"
        required
      ></v-text-field>

      <v-btn @click="validate" :disabled="!valid" v-if="loaded"
        >Load Repository</v-btn
      >
      <v-btn @click="resetModelState()" v-else loaded="!loaded;">
        Clear Repository
      </v-btn>
    </v-form>
    <v-treeview
      class="col-4"
      v-if="ready"
      :items="repository[0].children"
      hoverable
      item-key="children"
    >
      <template slot="label" slot-scope="{ item }">
        <a @click="itemClick(item.name)">{{ item.name }}</a>
      </template>
    </v-treeview>
  </v-container>
</template>

<script>
import { graphql } from "@octokit/graphql";
export default {
  name: "HelloWorld",

  data: () => ({
    key1: "6b4282865d685",
    key2: "e4889714aa9cb982ac9710e2a18",
    inputRules: [v => !!v || "Field is required"],
    owner: "",
    name: "",
    valid: false,
    filename: null,
    filecontent: null,
    loaded: true,
    ready: false,
    repository: [
      {
        id: 0,
        name: "root",
        children: [{}]
      }
    ]
  }),
  created() {
    this.$vuetify.theme.dark = true;
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.getRepositoryRoot();
        this.loaded = !this.loaded;
        return true;
      } else {
        this.resetModelState();
        return false;
      }
    },
    async getNextRepositoryLayer(currentRepositoryLayer) {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer  ${this.key1 + this.key2}`
        }
      });
      const { repository } = await graphqlWithAuth(`{
              repository(owner: "kadenlovell", name: "hellovuejs") {
                object(expression: "master:${currentRepositoryLayer}/") {
                  ... on Tree{
                        entries{
                          name
                    }
                  }
                }
              }
            }`);
      console.log(repository);
    },
    async getRepositoryRoot() {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer ${this.key1 + this.key2}`
        }
      });
      const { repository } = await graphqlWithAuth(`{
          repository(owner: "kadenlovell", name: "hellovuejs") {
            object(expression: "master:") {
              ... on Tree{
                    entries{
                      name
                }
              }
            }
          }
        }`);
      this.repository.children = [];
      for (var i = 0; i < repository.object.entries.length; i++) {
        this.repository[0].children[i] = repository.object.entries[i];
      }
      this.ready = true;
    },
    async itemClick(name) {
      console.log(name);
    },
    async resetModelState() {
      this.loaded = true;
      this.filecontent = null;
      this.filename = null;
      this.ready = false;
      this.repository = [
        {
          id: 0,
          name: "root",
          children: []
        }
      ];
    }
  }
};
</script>
