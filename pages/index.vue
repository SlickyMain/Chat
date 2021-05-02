<template>
  <v-layout column justify-center align-center >
    <v-flex xs12 sm8 md6  >
      <v-card min-width='2400'>
        <v-card-title> 
          <img src="../Logo.png" alt=""> <h1>Хвощ</h1></v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :counter="15"
            :rules="nameRules"
            label="Ваш ник"
            required
          ></v-text-field>

          <v-text-field
            v-model="room"
            :rules="roomRules"
            label="Название чата"
            required
          ></v-text-field>

          <v-btn
            :disabled="!valid"
            color="#ef481b"
            class="mr-4"
            @click="submit"
          >
            Log In
          </v-btn>

        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {mapMutations} from 'vuex'

  export default {
    layout:'empty', 
    head: {
      title:'Хвощ-чан'
      },
    sockets: {
    connect: function () {
      console.log("socket connected");
    },
  },
    data: () => ({
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Без ника никак, дружок-пирожок',
        v => (v && v.length <= 15) || 'Выбери ник меньше 15 символов, дружок-пирожок',
      ],
      room: '',
      roomRules: [
        v => !!v || 'Чат тоже нужно написать, дружок-пирожок'
      ]
    }),

    methods: {
      ...mapMutations(['setUser']),
      submit () {
        if (this.$refs.form.validate()) {
            const user = {
              name: this.name, 
              room: this.room
            }

             this.$socket.client.emit('userJoined', user, data => {
                if (typeof data === 'string') {
                  console.error(data);
                }
                else {
                  user.id = data.userId;
                  this.setUser(user);
                  this.$router.push('/chat');
                }
             });
        }
      }
    },
  }
</script>
