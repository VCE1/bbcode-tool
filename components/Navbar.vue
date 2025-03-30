<template>
    <header class="flex items-center justify-between h-20 w-full">
        <NuxtLink :to="isAboutPage ? `/${locale || 'en'}` : `#`" class="text-2xl font-bold">
            {{ $t('bbcode_generator') }}
        </NuxtLink>

        <div class="flex items-center space-x-5 ml-auto">
            <ThemeToggle />

            <NuxtLink :to="isAboutPage ? '#' : `/${locale || 'en'}/about`"
                class="text-base font-bold text-base-content px-1 py-1 transition-all duration-300 ease-in-out transform hover:scale-110"
                @click.prevent="handleAboutClick">
                {{ $t('about') }}
            </NuxtLink>

            <button ref="languageButton" class="btn" @click="toggleDropdown">
                {{ $t('language') }}
            </button>

            <ul v-show="isDropdownVisible" class="dropdown menu w-25 rounded-box bg-base-100 shadow-sm absolute"
                :style="dropdownStyle">
                <li><a @click="changeLanguage('en')">English</a></li>
                <li><a @click="changeLanguage('zh-CN')">简体中文</a></li>
                <li><a @click="changeLanguage('zh-TW')">繁体中文</a></li>
            </ul>
        </div>
    </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useRouter, useRoute } from 'vue-router';
import { computed, ref, onMounted } from 'vue';

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();

const currentLocale = computed(() => locale.value || 'en');

const isAboutPage = computed(() => route.path.endsWith('/about'));

const isDropdownVisible = ref(false);
const languageButton = ref(null);
const dropdownStyle = ref({});

const toggleDropdown = () => {
    isDropdownVisible.value = !isDropdownVisible.value;
    if (isDropdownVisible.value && languageButton.value) {
        const buttonRect = languageButton.value.getBoundingClientRect();
        dropdownStyle.value = {
            top: `${buttonRect.bottom + window.scrollY + 5}px`,
            left: `${buttonRect.left + buttonRect.width / 2 - 50}px`,
        };
    }
};

const changeLanguage = (lang) => {
    locale.value = lang;
    const currentPath = route.path;
    const newPath = currentPath.replace(/^\/[a-zA-Z-]+/, `/${lang}`);
    router.push(newPath);
};

const handleAboutClick = (event) => {
    if (isAboutPage.value) {
        event.preventDefault();
        return;
    }
    router.push(`/${currentLocale.value}/about`);
};

onMounted(() => {
    if (languageButton.value) {
        languageButton.value.getBoundingClientRect();
    }
});
</script>
