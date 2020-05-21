<template>
    <div class="container">
        <transition-group name="list" tag="div" class="columns is-multiline">
            <Card v-for="category in currentUser.projects"
                :title="category.name"
                :key="category.id" 
                size="is-4"
                @click="$router.push(`${$url.editCategory}?projectId=${category.id}`)">
                <template lang="html" v-slot:content>
                    <p>{{ category }}</p>
                </template>
            </Card>
        </transition-group>
    </div>
</template>

<script>
import Card from '@/components/Card.vue'
import { mapGetters } from 'vuex'
export default {
    components: {
        Card
    },
    computed: {
        ...mapGetters('user', ['currentUser']),
    }
}
</script>