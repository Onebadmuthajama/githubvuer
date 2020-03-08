<template>
  <v-container>
    <v-btn
      v-if="loaded"
      v-on:click="
        getRepoFiles();
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
        v-if="repository != null"
        :items="testObject"
        hoverable
        class="col-4"
        item-key="name"
      >
        <template slot="label" slot-scope="{ item }">
          <a @click="loadFile(`${item.name}`, `${item.parent}`)">{{
            item.name
          }}</a>
        </template>
      </v-treeview>

      <v-card v-if="filecontent != null" class="col-8">
        <v-card-text>
          <p class="display-1 text--primary">
            {{ filename }}
          </p>
          <div class="text--primary">
            <p>{{ filecontent }}}}</p>
          </div>
        </v-card-text>
      </v-card>
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
    repository: null,
    subdir: [
      {
        children: []
      }
    ],
    filename: null,
    testObject: [
      {
        id: 1,
        name: "repository",
        children: []
      }
    ],
    loaded: true,
    filecontent: null
  }),
  created() {
    this.$vuetify.theme.dark = true;
  },
  methods: {
    async getNextLayer(folder) {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer  ${this.key1 + this.key2}`
        }
      });
      const { repository } = await graphqlWithAuth(`{
              repository(owner: "onebadmuthajama", name: "hellovuejs") {
                object(expression: "master:${folder}/") {
                  ... on Tree{
                        entries{
                          name
                    }
                  }
                }
              }
            }`);
      for (var i = 0; i < repository.object.entries.length; i++) {
        this.subdir[0].children[i] = repository.object.entries[i];
      }
    },
    async getRepoFiles() {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer ${this.key1 + this.key2}`
        }
      });
      const { repository } = await graphqlWithAuth(`{
          repository(owner: "onebadmuthajama", name: "hellovuejs") {
            object(expression: "master:") {
              ... on Tree{
                    entries{
                      name
                }
              }
            }
          }
        }`);

      this.repository = repository;
      for (var i = 0; i < repository.object.entries.length; i++) {
        this.testObject[0].children[i] = repository.object.entries[i];
        if (this.testObject[0].children[i].name.split(".").length == 1) {
          await this.getStructure(this.testObject[0].children[i].name);
        }
      }
    },

    async loadFile(filename, parent) {
      console.log(parent + "/" + filename);
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer ${this.key1 + this.key2}`
        }
      });
      if (parent === null || parent === "undefined") {
        const { repository } = await graphqlWithAuth(`{
      repository(owner: "onebadmuthajama", name: "hellovuejs") {
        object(expression: "master:${filename}") {
             ... on Blob {
            text
          }
        }
      }
    }`);
        if (filename.split(".").length != 1) {
          if (repository.object != null) {
            this.filename = filename;
            this.filecontent = repository.object.text;
          }
        }
      } else {
        const { repository } = await graphqlWithAuth(`{
          repository(owner: "onebadmuthajama", name: "hellovuejs") {
            object(expression: "master:${parent}/${filename}") {
              ... on Blob {
                text
              }
            }
          }
        }`);
        if (filename.split(".").length != 1) {
          if (repository.object != null) {
            this.filename = filename;
            this.filecontent = repository.object.text;
          }
        }
      }
      // await this.getNextLayer(filename);
      //await this.getStructure(filename);
    },
    async getStructure(filename) {
      for (var i = 0; i < this.testObject[0].children.length; i++) {
        if (this.testObject[0].children[i].name === filename) {
          await this.getNextLayer(filename);
          this.testObject[0].children[i].children = [];

          for (var j = 0; j < this.subdir[0].children.length; j++) {
            this.testObject[0].children[i].children[j] = {
              name: `${this.subdir[0].children[j].name}`,
              parent: `${this.testObject[0].children[i].name}`
            };
          }
          console.log(this.testObject);
        }
      }
    },
    async resetModelState() {
      this.repository = null;
      this.testObject = [
        {
          id: 1,
          name: "repository",
          children: []
        }
      ];
      this.filecontent = null;
      this.filename = null;
      this.subdir = [
        {
          children: []
        }
      ];
    }
  }
};
</script>
