<template>
  <page-layout>
    <section class="py-4 bg-teal-dark">
      <div class="container">
        <form class="form">
          <div class="form__field relative">
            <i class="input-icon material-icons absolute text-grey-darker">search</i>
            <input
              class="input__search"
              id="where"
              type="text"
              placeholder="Mexico City, Mexico">
          </div>
        </form>
      </div>
    </section>
    <section class="section__create py-6">
      <div class="container">
        <h1 class="text-3xl">Publish a new room</h1>
        <form>
          <div class="mb-4">
            <label class="input__label">Title</label>
            <input v-model="publication.title" class="input__field" type="text" placeholder="House title">
          </div>
          <div class="mb-4">
            <label class="input__label">Description</label>
            <textarea v-model="publication.description" class="input__field" rows="10" placeholder="House description"></textarea>
          </div>
          <div class="mb-4">
            <label class="input__label">Featured Image</label>
            <input v-model="publication.featuredImage" class="input__field" type="text" placeholder="https://images.unsplash.com/photo-1432303492674-642e9d0944b">
          </div>
          <div class="mb-4">
            <label class="input__label">Services</label>
            <button v-for="(service, id) in services" :key="id"
              @click.prevent="addService(id)"
              class="font-semibold py-3 px-6 mr-4 rounded"
              :class="isActive(id) ? 'bg-blue-dark':'bg-blue-light'">
              {{ service.name }}
            </button>
          </div>
          <div class="mb-4">
            <label class="input__label">Price</label>
            <input v-model="publication.price" class="input__field" type="number" placeholder="25 ARS">
          </div>
          <div class="mb-4">
            <label class="input__label">Type</label>

            <select v-model="publication.type" class="input__field" placeholder="Select an option">
              <option value='' disabled> Select an opcion</option>
              <option value="Entire Guest Suite">Entire Guest Suite</option>
              <option value="Private Room in Apartment">Private Room in Apartment</option>
            </select>
          </div>
          <div class="mb-4 text-right">
            <button @click.prevent="save" class="w-full bg-yellow-dark text-yellow-darker font-semibold py-3 px-6 rounded">
              Publish
            </button>
          </div>
        </form>
      </div>
    </section>
  </page-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import PageLayout from '@/layouts/PageLayout.vue';

export default {
  name: 'CreateHousePage',
  data() {
    return {
      publication: {
        title: '',
        description: '',
        featuredImage: '',
        services: {},
        price: '',
        type: '',
        location: 'Jujuy, Argentina',
      },
    };
  },
  methods: {
    save() {
      const {
        title, description, featuredImage, services, price, type, location,
      } = this.publication;
      const room = {
        title,
        description,
        services,
        featured_image: featuredImage,
        publishedAt: Date.now(),
        price,
        type,
        location,
      };

      this.$store.dispatch('CREATE_ROOM', room).then(() => {
        this.$router.push({ name: 'SearchPage' });
      });
    },
    addService(serviceId) {
      if (this.publication.services[serviceId]) {
        this.$delete(this.publication.services, serviceId);
      } else {
        const id = JSON.parse(JSON.stringify(serviceId));
        this.$set(this.publication.services, id, id);
      }
    },
    isActive(serviceId) {
      if (this.publication.services[serviceId]) {
        return true;
      }
      return false;
    },
  },
  components: {
    PageLayout,
  },
  computed: {
    ...mapGetters(['services']),
  },
};
</script>
