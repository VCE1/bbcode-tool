<template>
    <div class="container mx-auto p-4">

        <div class="flex justify-between items-center mb-4">
            <Navbar />
        </div>

        <div v-for="(item, index) in items" :key="index" class="grid grid-cols-12 gap-2 items-center mb-2"
            draggable="true" @dragstart="handleDragStart($event, index)" @dragover="handleDragOver($event)"
            @drop="handleDrop($event, index)" @dragend="handleDragEnd">
            <input type="text" v-model="item.url" :placeholder="$t('placeholder_url')"
                class="input input-bordered col-span-3" @input="formatInput(index, 'url')" />
            <input type="text" v-model="item.page" :placeholder="$t('placeholder_page')"
                class="input input-bordered col-span-1" @input="formatInput(index, 'page')" />
            <input type="text" v-model="item.romaji" :placeholder="$t('placeholder_romaji')"
                class="input input-bordered col-span-2" @input="formatInput(index, 'romaji')" />
            <input type="text" v-model="item.japanese" :placeholder="$t('placeholder_japanese')"
                class="input input-bordered col-span-2" @input="formatInput(index, 'japanese')" />
            <input type="text" v-model="item.title" :placeholder="$t('placeholder_title')"
                class="input input-bordered col-span-3" @input="formatInput(index, 'title')" />
            <button @click="removeItem(index)" class="btn btn-error btn-sm col-span-1">✕</button>
        </div>

        <button @click="addItem" class="btn btn-primary mb-4">{{ $t('add') }}</button>

        <div class="p-4 bg-base-200 rounded-lg">
            <h2 class="text-lg font-bold mb-2 text-base-content">{{ $t('bbcode_preview') }}</h2>
            <textarea class="textarea textarea-bordered w-full h-40 font-mono bg-base-100 text-base-content" readonly
                :value="formattedBBCode"></textarea>
            <div class="mt-4">
                <button @click="toggleRawPreview" class="btn btn-accent">
                    {{ showRawPreview ? '➖ ' + $t('raw_preview_collapse') : '➕ ' + $t('raw_preview_toggle') }}

                </button>
                <div v-if="showRawPreview" class="mt-2 p-3 bg-base-200 rounded">
                    <pre class="whitespace-pre-wrap text-sm text-base-content">{{ rawBBCode }}</pre>
                </div>
            </div>

            <button @click="copyRawBBCode" class="btn btn-secondary mt-2">{{ $t('copy_raw') }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const items = ref([]);
const showRawPreview = ref(false);
const showWarning = ref(false);

const addItem = () => {
    items.value.push({ url: '', page: '', romaji: '', japanese: '', title: '' });
    showWarning.value = true;
};

const removeItem = (index) => {
    items.value.splice(index, 1);
    showWarning.value = true;
};

const parseUrl = (index) => {
    const url = items.value[index].url.trim();
    const match = url.match(/(\d+)$/);
    if (match) {
        items.value[index].page = formatPage(match[1]);
    }
};

const formatInput = (index, field) => {
    let value = items.value[index][field].trim();

    if (field === 'romaji' || field === 'japanese') {
        value = value.replace(/\s+/g, ' ');
    }

    if (field === 'url') {
        parseUrl(index);
    }

    items.value[index][field] = value;
    showWarning.value = true;
};

const handleDragStart = (event, index) => {
    event.dataTransfer.setData('index', index);
    event.target.style.opacity = '0.5';
};

const handleDragOver = (event) => {
    event.preventDefault();
    event.target.classList.add('drag-over');
};

const handleDrop = (event, index) => {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData('index');
    const draggedItem = items.value[draggedIndex];
    items.value.splice(draggedIndex, 1);
    items.value.splice(index, 0, draggedItem);
};

const handleDragEnd = () => {
    const itemsList = document.querySelectorAll('[draggable="true"]');
    itemsList.forEach(item => item.style.opacity = '1');
};

const getAuthor = (item) => {
    return item.romaji && item.japanese ? `${item.romaji} / ${item.japanese}` : item.romaji || item.japanese || '';
};

const formatPage = (page) => {
    return page.padStart(3, '0');
};

const generateDynamicDots = (author, title, baseLength) => {
    const currentLength = author.length + title.length + 3;
    const remainingLength = baseLength - currentLength;
    return remainingLength > 0 ? '…'.repeat(Math.max(1, remainingLength)) : '';
};

const formattedBBCode = computed(() => {
    const baseLength = 60;
    return items.value
        .map((item) => {
            const author = getAuthor(item);
            if (!item.page || !author) return '';

            const dots = item.title ? generateDynamicDots(author, item.title, baseLength) : '';
            return `${formatPage(item.page)} ・ ${author} ${dots}${item.title ? ` 『${item.title}』` : ''}`;
        })
        .filter(Boolean)
        .join('\n');
});

const rawBBCode = computed(() => {
    const baseLength = 60;
    return items.value
        .map((item) => {
            const author = getAuthor(item);
            const dots = item.title ? generateDynamicDots(author, item.title, baseLength) : '';
            return item.url && item.page && author
                ? `[url=${item.url}]${formatPage(item.page)}[/url] ・ ${author} ${dots}${item.title ? ` 『${item.title}』` : ''}`
                : '';
        })
        .filter(Boolean)
        .join('\n');
});

const copyRawBBCode = async () => {
    try {
        await navigator.clipboard.writeText(rawBBCode.value);
    } catch (err) {
        console.error($t('copy_failed'), err);
        alert($t('copy_failed'));
    }
};

const toggleRawPreview = () => {
    showRawPreview.value = !showRawPreview.value;
};

const beforeUnloadHandler = (event) => {
    if (showWarning.value) {
        event.preventDefault();
        event.returnValue = $t('unsaved_warning');
    }
};

onMounted(() => {
    window.addEventListener("beforeunload", beforeUnloadHandler);
});

onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", beforeUnloadHandler);
});
</script>
