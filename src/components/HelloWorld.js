import { graphql } from "@octokit/graphql";
export default {
  name: "HelloWorld",

  data: () => ({
    repository: null,
    subdir: null,
    loaded: true
  }),
  created() {
    this.$vuetify.theme.dark = true;
  },
  methods: {
    // 483e772699478b5d98e2d99f2720f96044770d16
    async getNextLayer(filename) {
      if (filename.split(".").length > 1) {
        await this.loadFile(filename);
      }
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `bearer 483e772699478b5d98e2d99f2720f96044770d16`
        }
      });
      const { repository } = await graphqlWithAuth(`{
          repository(owner: "onebadmuthajama", name: "hellovuejs") {
            object(expression: "master:${filename}/") {
              ... on Tree{
                    entries{
                      name
                }
              }
            }
          }
        }`);
      this.subdir = repository;
    },
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
    },

    async loadFile(filename) {
      console.log(`loadfile called with ${filename}`);

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

      console.log(repository);
    }
  }
};
