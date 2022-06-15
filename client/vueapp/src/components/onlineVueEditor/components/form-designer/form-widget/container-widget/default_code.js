export function defaultCode(item, methodList) {
  return `{
    components: {},
    data () {
      return {}
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {},
    methods: {
      ${methodList}
    }
  }`
}
