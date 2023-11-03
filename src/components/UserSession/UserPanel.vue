<template>
    <q-card class="bg-secondary text-primary" style="height: 42rem; min-width: 60rem; border-radius: 5px;">
        <q-toolbar class="bg-secondary q-pa-none">
          <div class="row items-start full-width no-wrap">
            <div>
              <q-btn color="accent" text-color="secondary" v-close-popup style="height: 3.0rem; width: 3.0rem; border-radius: 3px; margin-top: -1px;">
                  <q-icon name="close" >  
                  </q-icon>
              </q-btn>
            </div>
          
            <q-tabs
              v-model="tab"
              no-caps
              class="bg-secondary text-primary full-width"
              :breakpoint="0"
              align="justify"
              indicator-color="accent"
              active-color="primary"
            >
              <q-tab name="current" :label="$t('userPanel.currentUser')" :disable="!getSelectedUser" class="text-capitalize" />
              <q-tab name="selection" :label="$t('userPanel.userSelection')" class="text-capitalize" />
            </q-tabs>
          </div>
          
        </q-toolbar>

        <q-card-section class="q-pt-md">
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="current">
                <div v-if="showUserCreate" class="row items-start">
                  <div class="column full-width">
                    <user-create-side-bar
                      @close="
                        showUserCreate = false;
                        editThisUser = null;
                      "
                      :user="editThisUser"
                    />
                  </div>
                </div>
                <div v-else class="row items-start">
                    <current-user v-if="!!getSelectedUser" @edit-user="editUser"/>
                  </div>
            </q-tab-panel>

            <q-tab-panel name="selection">
              <div v-if="showUserCreate">
                  <user-create-side-bar
                    @close="
                      showUserCreate = false;
                      editThisUser = null;
                    "
                    :user="editThisUser"
                  />
              </div>
              <div v-if="!showUserCreate && tab === 'selection'" class="row">
                <q-list class="full-width" separator>
                  <div class="q-px-lg q-pt-md q-pb-md">
                  <q-btn
                    size="lg"
                    @click="showUserCreate = true" color="accent" text-color="secondary" :label="$t('userPanel.addUser')" class="full-width" />
                  </div>
                  <q-separator />
                  <q-separator />
                  <q-scroll-area style="height: 28rem; margin-top: auto; margin-bottom: 0;">
                  <q-slide-item
                    class="bg-secondary"
                    v-for="user in otherUsers"
                    :key="user.id"
                    @right="({ reset }) => {
                      $emit('delete-user', { id: user.id, reset })
                    }"
                    
                    
                    right-color="negative"
                  >
                    <template v-slot:right>
                      <div class="row items-center justify-between">
                        Delete <q-icon right name="delete_forever" />
                      </div>
                    </template>
                    
                    <q-item
                      class="q-py-md"
                      clickable
                      v-ripple
                      @click="
                        () => {
                          selectUserWithId(user.id);
                        }
                      "
                    >
                      <q-item-section avatar>
                        <q-avatar rounded>
                          <img :src="generateAvatarPath(user.avatar.name)" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>{{ user.name }}</q-item-section>
                    </q-item>
                  </q-slide-item>
                  </q-scroll-area>
                  <q-separator />
                </q-list>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>

</template>

<script>
import { defineComponent } from '@vue/composition-api';
import { ref } from '@vue/composition-api'
import { mapState, mapActions, mapGetters } from 'vuex';
import UserCreateSideBar from 'components/UserSession/UserCreateSideBar';
import { useGenerateAvatarPath } from 'components/UserSession/AvatarSelection';
import CurrentUser from 'src/components/UserSession/CurrentUserWidget';

export default defineComponent({
  components: {
    CurrentUser,
    UserCreateSideBar
  },
  setup () {
    return {
      ...useGenerateAvatarPath(),
      editThisUser: ref(null),
    }
  },
  data () {
    return {
      tabValue: 'selection',
      showUserCreate: false,
      showConfirmDeleteDialog: false,
      pendingDeleteRequest: {
        id: '',
        reset: () => { 'Nothing to reset' }
      },
      loginWindow: null,
      authEventListener: null,
      checkingOnlineState: true,
      isOffline: false
    }
  },
  methods: {
    ...mapActions('userLibrary', [
      'hideUserLibrary',
      'toggleUserLibrary',
      'selectUser',
      'updateUserList',
      'deleteUser'
    ]),
    ...mapActions('musicLibrary', { hideMusicLibrary: 'hideMusicLibrary'}),
    editUser() {
      console.log('Event received');
      this.editThisUser = this.getSelectedUser;
      console.log(this.editThisUser)
      this.showUserCreate = true;
    },
    selectUserWithId(id) {
      this.selectUser(id);
      this.hideUserLibrary();
    }
  },
  computed: {
    ...mapState('userLibrary', {
      right: state => state.show,
      users: state => state.users
    }),
    ...mapState('musicLibrary', {
      left: state => state.show,
      isAuthenticated: state => state.isAuthenticated
    }),
    ...mapGetters('userLibrary', ['getSelectedUser']),
    otherUsers() {
      if (this.getSelectedUser) {
        return this.users.filter((u) => u.id !== this.getSelectedUser.id);
      } else {
        return this.users;
      }
    },
    tab: {
      get () {
        return this.tabValue;
      },
      set (value) {
        this.showUserCreate = false;
        this.editThisUser = null;
        this.tabValue = value;
      }
    },
    musicLibDrawer: {
      get() {
        return this.left;
      },
      async set() {
        this.hideMusicLibrary();
      }
    },
    userLibDrawer: {
      get() {
        return this.right;
      },
      set() {
        this.hideUserLibrary();
      }
    },
  },
  async mounted() {
    // this.updateUserList();
    // One Version: Start at selection, and then go to current user by default
    // this.tab = this.getSelectedUser ? 'current' : 'selection'
    // Another Version: Always show the selection
  }
})
</script>
