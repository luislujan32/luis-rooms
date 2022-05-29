<template>
  <div class="slider-wrapper">
    <slot></slot>
  </div>
</template>

<script>
import { tns } from 'tiny-slider/src/tiny-slider';
import 'tiny-slider/dist/tiny-slider.css';

export default {
  name: 'TinySlider',
  data() {
    return {
      // Cuando se aplica un '$' al principio de la var, es porque no se utiliza reactividad,
      // por lo que los observables no se aplican a este elemento
      $slider: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const settings = {
        // Elemento padre que se encuentra en el componente, en este caso el div.slider-wrapper
        container: this.$el,
        mode: 'gallery',
      };
      this.$slider = tns(settings);
    },
  },
  beforeDestroy() {
    if (this.$slider) {
      this.$slider.destroy();
    }
  },
};
</script>
