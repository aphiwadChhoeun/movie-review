<template>
    <Page>
        <ScrollView orientation="vertical">
            <ActionBar title="Movie Review"/>
            <StackLayout>
                <ActivityIndicator busy="true" class="loading__indicator" v-if="isLoading"></ActivityIndicator>
                <Label :text="name" class="actor-name"/>
                <Label :text="job"/>
                <Image :src="picture | imagePath" stretch="aspectFit" width="100%"/>
                <Label text="Known for:"/>
                <ScrollView orientation="horizontal" height="200">
                    <StackLayout orientation="horizontal">
                        <MovieThumb v-for="item in knownFor" :movie="item" class="knownfor-item">
                        </MovieThumb>
                    </StackLayout>
                </ScrollView>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import axios from 'axios';
    import common from "./mixins/common";
    import Detail from "./Detail";
    import MovieThumb from "./MovieThumb";

    export default {
        name: "People",
        props: {
            id: Number,
        },
        mixins: [common],
        components: {
            MovieThumb
        },
        filters: {},
        data() {
            return {
                isLoading: true,
                name: null,
                picture: null,
                job: null,
                knownFor: []
            }
        },
        created() {
            axios.get('https://api.themoviedb.org/3/credit/' + this.id + '?api_key=' + this.$store.state.apiKey)
                .then(resp => resp.data)
                .then((result) => {
                    this.name = result.person.name;
                    this.job = result.job;
                    this.picture = result.person.profile_path;
                    this.knownFor = result.person.known_for;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
    }
</script>

<style scoped>
    .actor-name {
        font-size: 28;
    }

    .knownfor-item {
        margin-right: 5;
        margin-left: 5;
    }
</style>