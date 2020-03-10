<template>
  <v-container>
    <v-btn
      v-if="loaded"
      v-on:click="
        getRepositoryRoot();
        loaded = !loaded;
      "
      >Load Repository</v-btn
    >
    <v-btn
      v-else
      v-on:click="
        resetModelState();
        loaded = !loaded;
      "
    >
      Clear Repository
    </v-btn>
    <v-container class="d-flex">
      <v-treeview
        v-if="ready"
        :items="repository[0].children"
        hoverable
        class="col-4"
        item-key="children"
      >
        <template slot="label" slot-scope="{ item }">
          <a @click="itemClick(item.name)">{{ item.name }}</a>
        </template>
      </v-treeview>
    </v-container>
  </v-container>
</template>

<script>
import { graphql } from "@octokit/graphql";
export default {
  name: "HelloWorld",

  data: () => ({
    key1: "6b4282865d685",
    key2: "e4889714aa9cb982ac9710e2a18",
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
    async getNextRepositoryLayer(folder) {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer  ${this.key1 + this.key2}`
        }
      });
      const { repository } = await graphqlWithAuth(`{
              repository(owner: "kadenlovell", name: "hellovuejs") {
                object(expression: "master:${folder}/") {
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
      console.log(repository.object.entries);
      this.repository.children = [];
      for (var i = 0; i < repository.object.entries.length; i++) {
        this.repository[0].children[i] = repository.object.entries[i];
      }
      this.ready = true;
      console.log(this.repository[0]);
    },
    async itemClick(name) {
      console.log(name);
    },
    async resetModelState() {
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
