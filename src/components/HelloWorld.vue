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
        repository = null;
        loaded = !loaded;
      "
    >
      Clear Repository
    </v-btn>
    <v-treeview
      v-if="repository != null"
      hoverable
      :items="repository.object.entries"
    ></v-treeview>
  </v-container>
</template>

<script src="./HelloWorld.js"></script>
