import { defineComponent, onMounted, computed, reactive, ref, toRefs, provide, inject, nextTick, watch } from 'vue';
import { useStore } from '@/stores/vuex';
// import { useStore } from '@/store';
import { type LocationQuery, useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'Activities',
  setup() {
    const conclusionFormRef = ref(null);
    const contentLoading = ref(false);
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const collectEnable = computed(() => store.getters.collectEnable); // 收藏限定
    const userName = computed(() => store.state.userName);
    const maxHeight = computed(() => store.state.windowHeight - (52 + 24 + 32 + 16 + 64 + 16));
    const activityTypeMap = computed(() => store.state.home.activityTypeMap);
    const activityTypeColorMap = computed(() => store.state.home.activityTypeColorMap);
    const projectNameMap = computed(() => store.state.home.projectNameMap);
    const loadedKey = ref(0);
    const sliderKey = ref('activity_slider');
    const sliderWidth = ref(0);

    const editLeaveBefore = inject('editLeaveBefore');

    state.loading = true;
    onMounted(async () => {
      // setPagesize();
      // Promise.all([getProjects(), getActivityConfig()]).then(async () => {
      //   updateFilterData();
      //   await getActivities();
      //   resetDetail(route.query);
      // });
      // getApplicantList();
    });

    return {
      conclusionFormRef,
      contentLoading,
      store,
      router,
      route,
      collectEnable,
      userName,
      maxHeight,
      activityTypeMap,
      activityTypeColorMap,
      projectNameMap,
      loadedKey,
      sliderKey,
      sliderWidth,
      editLeaveBefore,
    };
  },
  render() {
    return (
      <section class="om-activity">
        <section class="activity-condition flex">{this.sliderWidth}</section>
      </section>
    );
  },
});
