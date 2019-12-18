<template>
    <FlexboxLayout flexDirection="column">
        <Image :src="movie.poster_path | imagePath" stretch="aspectFit" width="100%"/>
    </FlexboxLayout>
</template>

<script>
    import common from "./mixins/common";

    export default {
        name: 'MovieThumb',
        props: {
            movie: Object
        },
        mixins: [common]
    }
</script>