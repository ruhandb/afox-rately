<template>
  <ins class="adsbygoogle"
    style="display:block"
    :data-ad-client="googleAdId"
    :data-ad-slot="adSlot"
    :data-ad-format="format"
    :data-full-width-responsive="fullWidthResponsive"></ins>
</template>

<script>
export default {
    name: "GoogleAds",
    props: {
        timeout: Number,
        adSlot: String,
        fullWidthResponsive:{
            type: String,
            default: "true"
        },
        format:{
            type: String,
            default: "auto"
        }
    },
    data() {
        return {
            googleInit: null,
            googleAdId: "ca-pub-2437559594817961"
        };
    },
    mounted() {
        let timeout = 200;
        if(this.timeout) timeout = this.timeout;
        this.googleInit = setTimeout(() => {
            if (typeof window !== "undefined")
                (window.adsbygoogle = window.adsbygoogle || []).push({});
        }, timeout);
    },
    destroyed() {
        if (this.googleInit) clearTimeout(this.googleInit);
    }
}
</script>