<template>
    <div class="container mx-auto p-6">
        <Navbar />

        <h1 class="text-2xl font-bold mb-4">{{ $t('about') }}</h1>

        <div class="prose">
            <h3>{{ $t('bbcode_description') }}</h3>
            <br>
            <a href="/example.png" target="_blank">
                <img src="/example.png" alt="example" class="w-1/2" />
            </a>
            <p class="text-sm text-gray-500 mt-2"><a href="https://e-hentai.org/g/2783354/b7fde6d016/" target="_blank"
                    class="text-blue-500 hover:underline">source</a></p>

            <h3>{{ $t('github') }}</h3>
            <p class="mt-4">
                <a href="https://github.com/VCE1/bbcode-tool" target="_blank"
                    class="text-blue-500 hover:underline flex items-center space-x-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub"
                        class="w-5 h-5" />
                    <span>bbcode-tool</span>
                </a>
            </p>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
const { t } = useI18n();
const route = useRoute();
route.params.lang || 'en';

</script>

<style scoped></style>
