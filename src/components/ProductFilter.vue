```vue
<script setup>
import { ref, onMounted } from 'vue';
import Button from '@/components/Button.vue';

const categoryUrl = `${import.meta.env.VITE_API_BASE_URL}/api/category`;

const emit = defineEmits(['productUpdate']);

const categories = ref([]);
const translations = ref({});
const searchName = ref('');
const selectedCategory = ref('');

onMounted(async () => {
    await Promise.all([fetchCategories(), fetchTranslations()]);
});

async function fetchCategories() {
    try {
        const response = await fetch(categoryUrl);
        if (response.ok) {
            categories.value = await response.json();
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchTranslations() {
    try {
        const response = await fetch(`${categoryUrl}/translation`);
        if (response.ok) {
            translations.value = await response.json();
        }
    } catch (error) {
        console.error('Error fetching translations:', error);
    }
}

function onSearch() {
    emit('productUpdate', { name: searchName.value, category: selectedCategory.value });
}

function onReset() {
    searchName.value = '';
    selectedCategory.value = '';
    emit('productUpdate');
}
</script>

<template>
    <div class="container mb-4">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="input-group">
                    <input v-model="searchName" type="text" class="form-control" placeholder="Produktname suchen..."
                        @keyup.enter="onSearch" />
                    <select v-model="selectedCategory" class="form-select" @change="onSearch">
                        <option value="">Alle Kategorien</option>
                        <option v-for="category in categories" :key="category" :value="category">
                            {{ translations[category] || category }}
                        </option>
                    </select>
                    <Button variant="accent" :onClick="onSearch">Suchen</Button>
                    <Button variant="secondary" :onClick="onReset">Reset</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>