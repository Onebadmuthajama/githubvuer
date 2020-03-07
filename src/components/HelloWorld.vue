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
        activatable
        hoverable
        class="col-4"
        item-key="name"
      >
        <template slot="label" slot-scope="{ item }">
          <a @click="loadFile(`${item.name}`)">{{ item.name }}</a>
        </template>
      </v-treeview>
      <v-card v-if="filecontent != null" class="col-8">
        <v-card-text>
          <p class="display-1 text--primary">
            {{ filename }}
          </p>
          <div class="text--primary">
            <p v-html="filecontent"></p>
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
    repository: null,
    subdir: null,
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
    // 483e772699478b5d98e2d99f2720f96044770d16
    //    async getNextLayer(filename) {
    //      if (filename.split(".").length > 1) {
    //        await this.loadFile(filename);
    //      }
    //      const graphqlWithAuth = graphql.defaults({
    //        headers: {
    //          authorization: `bearer 483e772699478b5d98e2d99f2720f96044770d16`
    //        }
    //      });
    //      const { repository } = await graphqlWithAuth(`{
    //          repository(owner: "onebadmuthajama", name: "hellovuejs") {
    //            object(expression: "master:${filename}/") {
    //              ... on Tree{
    //                    entries{
    //                      name
    //                }
    //              }
    //            }
    //          }
    //        }`);
    //      this.subdir = repository;
    //    },
    async getRepoFiles() {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer 483e772699478b5d98e2d99f2720f96044770d16`
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
      }
    },

    async loadFile(filename) {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer 483e772699478b5d98e2d99f2720f96044770d16`
        }
      });
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
        this.filename = filename;
      }
      this.filecontent = repository.object.text.replace(/\n/g, "<br/>");
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
      this.subdir = null;
    }
  }
};
</script>
