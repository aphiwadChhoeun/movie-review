<template>
    <Page>
        <ScrollView orientation="vertical">
            <ActionBar title="Movie Review"/>
            <StackLayout>
                <ActivityIndicator busy="true" class="loading__indicator" v-if="isLoading"></ActivityIndicator>
                <Label :text="title" class="title"/>
                <Label :text="airDate"/>
                <Label :text="type | uppercase"/>
                <Label :text="tagline" class="tagline" v-if="tagline"/>
                <Label :text="overview" textWrap="true" class="overview"/>\
                <AbsoluteLayout>
                    <Image :src="poster | imagePath" stretch="aspectFit" width="100%"/>
                    <Label :text="rating | rating" class="rating"/>
                </AbsoluteLayout>

                <Label text="Casts"/>
                <ScrollView orientation="horizontal" height="200">
                    <StackLayout orientation="horizontal">
                        <FlexboxLayout v-for="item in credits" class="credit__item" flexDirection="column"
                                       @longPress="onActorLongPress(item)">
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

    const Clipboard = require("nativescript-clipboard");
    const Toast = require("nativescript-toast");

    export default {
        name: "Detail",
        props: {
            id: Number,
            type: String
        },
        filters: {
            imagePath(value) {
                return 'https://image.tmdb.org/t/p/w500' + value;
            },
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
                title: '',
                airDate: '',
                tagline: '',
                overview: '',
                poster: '',
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
            onActorLongPress(actor) {
                Clipboard.setText(actor.name).then(function () {
                    console.log("OK, copied to the clipboard");
                    Toast.makeText("Copied!").show();
                })
            }
        }
    }
</script>

<style scoped>
    Label {
        color: #ffffff;
    }

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

    .rating {
        font-size: 18;
        background: rgba(255, 255, 255, .5);
        color: #050505;
        padding-left: 5;
        padding-right: 5;
    }

    .credit__item {
        margin-right: 10;
        margin-left: 10;
    }

    .character-name {
        color: #1384ba;
        font-style: italic;
    }

    .genre {
        margin-top: 15;
    }

</style>