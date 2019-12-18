<template>
    <Page>
        <ScrollView orientation="vertical">
            <ActionBar title="Movie Review"/>
            <StackLayout>
                <ActivityIndicator busy="true" class="loading__indicator" v-if="isLoading"></ActivityIndicator>
                <Label :text="title" class="title"/>
                <Label :text="`Release Date: ${airDate}`"/>
                <Label :text="runtime | timeFormat" v-if="runtime"/>
                <Label :text="type | uppercase"/>
                <Label :text="tagline" class="tagline" v-if="tagline"/>
                <Label :text="overview" textWrap="true" class="overview"/>\
                <AbsoluteLayout>
                    <Image :src="poster | imagePath" stretch="aspectFit" width="100%"/>
                    <AbsoluteLayout class="rating-panel"></AbsoluteLayout>
                    <CircularProgressBar :size="45" :progress="rating * 10">
                        <Label :text="`${rating * 10}%`" marginTop="12" marginLeft="10"></Label>
                    </CircularProgressBar>
                </AbsoluteLayout>

                <Label text="Casts"/>
                <ScrollView orientation="horizontal" height="200">
                    <StackLayout orientation="horizontal">
                        <FlexboxLayout v-for="item in credits" class="credit__item" flexDirection="column"
                                       @tap="onActorTap(item)">
                            <Image stretch="aspectFit" :src="item.profile_path | imagePath" height="170"/>
                            <Label :text="item.name" class="actor-name"/>
                            <Label :text="item.character" class="character-name"/>
                        </FlexboxLayout>
                    </StackLayout>
                </ScrollView>

                <Label :text="'Genres: ' + genresDisplay" class="genre"/>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import axios from 'axios';
    import People from "./People";
    import CircularProgressBar from "./libs/CircularProgressBar";
    import common from "./mixins/common";

    export default {
        name: "Detail",
        props: {
            id: Number,
            type: String
        },
        components: {
            CircularProgressBar
        },
        mixins: [common],
        filters: {
            capitalize(value) {
                if (!value) return '';
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
            },
            uppercase(value) {
                return value.toUpperCase();
            },
            rating(value) {
                return value + '/10';
            },
            timeFormat(value) {
                let hour = parseInt(value / 60);
                let minute = parseInt(value % 60);
                return `Runtime: ${hour}h ${minute}m`;
            }
        },
        computed: {
            genresDisplay() {
                return this.genres.map(v => v.name).join(', ');
            }
        },
        data() {
            return {
                isLoading: true,
                title: null,
                airDate: null,
                tagline: null,
                overview: null,
                poster: null,
                runtime: null,
                rating: 0,
                genres: [],
                credits: []
            }
        },
        created() {
            if (this.type === 'movie') {
                axios.get('https://api.themoviedb.org/3/movie/' + this.id + '?api_key=' + this.$store.state.apiKey)
                    .then(resp => resp.data)
                    .then((result) => {
                        this.title = result.original_title;
                        this.tagline = result.tagline;
                        this.overview = result.overview;
                        this.poster = result.poster_path;
                        this.genres = result.genres;
                        this.airDate = result.release_date;
                        this.rating = result.vote_average;
                        this.runtime = result.runtime;

                        axios.get('https://api.themoviedb.org/3/movie/' + this.id + '/credits?api_key=' + this.$store.state.apiKey)
                            .then(resp => resp.data)
                            .then((result) => {
                                this.credits = result.cast;
                            });
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            } else if (this.type === 'tv') {
                axios.get('https://api.themoviedb.org/3/tv/' + this.id + '?api_key=' + this.$store.state.apiKey)
                    .then(resp => resp.data)
                    .then((result) => {
                        this.title = result.original_name;
                        this.overview = result.overview;
                        this.poster = result.poster_path;
                        this.genres = result.genres;
                        this.airDate = result.first_air_date;
                        this.rating = result.vote_average;

                        axios.get('https://api.themoviedb.org/3/tv/' + this.id + '/credits?api_key=' + this.$store.state.apiKey)
                            .then(resp => resp.data)
                            .then((result) => {
                                this.credits = result.cast;
                            });
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            }
        },
        methods: {
            onActorTap(actor) {
                this.$navigateTo(People, {
                    props: {
                        id: actor.credit_id
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .title {
        font-size: 28;
        font-weight: bold;
    }

    .tagline {
        font-size: 16;
    }

    .overview {
        margin-top: 20;
    }

    .rating-panel {
        width: 100%;
        height: 100;
        background: linear-gradient(to bottom, rgba(0, 0, 0, .5), transparent);
    }

    .credit__item {
        margin-right: 10;
        margin-left: 10;
    }

    .actor-name {
        font-weight: bold;
    }

    .character-name {
        color: #1384ba;
        font-style: italic;
    }

    .genre {
        margin-top: 15;
    }

</style>