<template>
    <Page>
        <ActionBar title="Movie Review"/>
        <GridLayout columns="*" rows="*">1
            <ActivityIndicator busy="true" class="loading__indicator" v-if="isLoading"></ActivityIndicator>
            <ListView for="item in trendingList" @itemTap="onItemTap">
                <v-template>
                    <AbsoluteLayout>
                        <Image :src="item.backdrop_path | imagePath" stretch="aspectFit" width="100%"/>
                        <Label :text="item.name || item.title" textWrap="true" class="list__item__title"/>
                        <Label :text="item.vote_average | rating" class="list__item__rating" top="24"/>
                    </AbsoluteLayout>
                </v-template>
            </ListView>
        </GridLayout>
    </Page>
</template>

<script>
    import axios from 'axios';
    import Detail from "./Detail";
    import common from "./mixins/common";

    export default {
        data() {
            return {
                isLoading: true,
                trendingList: []
            }
        },
        mixins: [common],
        filters: {
            rating(value) {
                return value + '/10';
            }
        },
        created() {
            axios.get('https://api.themoviedb.org/3/trending/all/week?api_key=' + this.$store.state.apiKey)
                .then(resp => resp.data.results)
                .then((result) => {
                    this.isLoading = false;
                    this.trendingList = result;
                })
        },
        methods: {
            onItemTap(event) {
                this.$navigateTo(Detail, {
                    props: {
                        id: event.item.id,
                        type: 'name' in event.item ? 'tv' : 'movie'
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .list__item__title {
        font-size: 18;
        background: rgba(83, 186, 130, .5);
        color: #050505;
        padding-left: 5;
        padding-right: 5;
    }

    .list__item__rating {
        font-size: 18;
        background: rgba(255, 255, 255, .5);
        color: #050505;
        padding-left: 5;
        padding-right: 5;
    }
</style>
