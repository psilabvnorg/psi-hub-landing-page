import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PhLogo } from '@/components/PhLogo';

/* ─── Types ─────────────────────────────────────────── */
interface Param {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description?: string;
}

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  params?: Param[];
  returns?: string;
  note?: string;
  example?: { request?: string; response?: string };
}

interface Group {
  label: string;
  endpoints: Endpoint[];
  note?: string;
}

/* ─── Data ───────────────────────────────────────────── */
const BASE_URLS = {
  main: 'http://localhost:6901/api/v1',
  tts: 'http://localhost:6902/api/v1',
};

const groups: Group[] = [
  {
    label: 'System',
    endpoints: [
      { method: 'GET', path: '/health', description: 'Health check',
        example: { response: `{ "status": "ok" }` } },
      { method: 'GET', path: '/status', description: 'System status and version info',
        example: { response: `{\n  "status": "running",\n  "uptime": 3600,\n  "version": "1.0.0"\n}` } },
      { method: 'GET', path: '/logs/tail', description: 'Retrieve last N log lines', params: [{ name: 'lines', type: 'query int', default: '200' }] },
      { method: 'GET', path: '/logs/stream', description: 'Stream logs in real-time (SSE)' },
      { method: 'DELETE', path: '/cache/temp', description: 'Clear temporary cache' },
      { method: 'GET', path: '/files/{file_id}', description: 'Download a processed file by ID' },
    ],
  },
  {
    label: 'Video Processing',
    endpoints: [
      {
        method: 'POST', path: '/video/download', description: 'Download video from URL (YouTube, TikTok, …)',
        params: [
          { name: 'url', type: 'string', required: true },
          { name: 'platform', type: 'string', required: true },
          { name: 'convert_to_h264', type: 'boolean', default: 'false' },
          { name: 'save_dir', type: 'string' },
        ],
        returns: '{ job_id }',
        example: {
          request: `{\n  "url": "https://www.youtube.com/watch?v=abc123",\n  "platform": "youtube",\n  "convert_to_h264": true\n}`,
          response: `{ "job_id": "dl_a1b2c3d4" }`,
        },
      },
      { method: 'GET', path: '/video/download/stream/{job_id}', description: 'Stream download progress (SSE)' },
      { method: 'GET', path: '/video/download/status/{job_id}', description: 'Poll download status' },
      {
        method: 'POST', path: '/video/trim', description: 'Trim video to time range (multipart form)',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'start_time', type: 'string', required: true, description: 'e.g. 00:00:05' },
          { name: 'end_time', type: 'string' },
        ],
        returns: '{ status, filename, download_url }',
        example: {
          request: `# multipart/form-data\nfile: video.mp4\nstart_time: 00:00:10\nend_time: 00:01:30`,
          response: `{\n  "status": "success",\n  "filename": "trimmed_video.mp4",\n  "download_url": "/api/v1/files/abc123"\n}`,
        },
      },
      {
        method: 'POST', path: '/video/extract-audio', description: 'Extract audio track from video',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'format', type: 'string', default: 'mp3' },
        ],
        returns: '{ status, filename, download_url }',
        example: {
          request: `# multipart/form-data\nfile: video.mp4\nformat: mp3`,
          response: `{\n  "status": "success",\n  "filename": "audio.mp3",\n  "download_url": "/api/v1/files/xyz789"\n}`,
        },
      },
      {
        method: 'POST', path: '/video/extract-audio-from-fileid', description: 'Extract audio using an existing file_id',
        params: [
          { name: 'file_id', type: 'string', required: true },
          { name: 'format', type: 'string', default: 'mp3' },
          { name: 'save_dir', type: 'string' },
        ],
      },
      {
        method: 'POST', path: '/video/speed', description: 'Adjust video playback speed (multipart form)',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'speed', type: 'float', required: true, description: 'e.g. 1.5' },
        ],
      },
    ],
  },
  {
    label: 'Audio Processing',
    endpoints: [
      {
        method: 'POST', path: '/audio/convert', description: 'Convert audio to another format',
        params: [{ name: 'file', type: 'file', required: true }, { name: 'output_format', type: 'string', required: true }],
      },
      {
        method: 'POST', path: '/audio/trim', description: 'Trim audio to time range',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'start_time', type: 'string', required: true },
          { name: 'end_time', type: 'string' },
          { name: 'output_format', type: 'string', default: 'mp3' },
        ],
      },
      {
        method: 'POST', path: '/audio/speed', description: 'Adjust audio speed',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'speed', type: 'float', required: true },
        ],
        returns: '{ status, filename, download_url, speed }',
        example: {
          request: `# multipart/form-data\nfile: audio.mp3\nspeed: 1.5`,
          response: `{\n  "status": "success",\n  "filename": "audio_1.5x.mp3",\n  "download_url": "/api/v1/files/spd001",\n  "speed": 1.5\n}`,
        },
      },
      {
        method: 'POST', path: '/media/remove-silence', description: 'Remove silence from audio',
        params: [{ name: 'file', type: 'file', required: true }, { name: 'padding_ms', type: 'int', default: '200' }],
      },
      { method: 'GET', path: '/media/remove-silence/stream/{task_id}', description: 'Stream silence-removal progress (SSE)' },
      { method: 'GET', path: '/media/remove-silence/result/{task_id}', description: 'Get silence-removal result' },
    ],
  },
  {
    label: 'Image Processing',
    endpoints: [
      { method: 'GET', path: '/image/upscale/models', description: 'List available upscale models', returns: '{ models[], binary_found }' },
      {
        method: 'POST', path: '/image/upscale', description: 'Upscale image (multipart form)',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'scale', type: 'int', default: '4' },
          { name: 'model_name', type: 'string', default: 'ultrasharp-4x' },
        ],
      },
      {
        method: 'POST', path: '/transparent-logo', description: 'Make logo background transparent',
        params: [{ name: 'file', type: 'file', required: true }, { name: 'tolerance', type: 'int', default: '1' }],
      },
      {
        method: 'POST', path: '/image-border', description: 'Add border to PNG image',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'thickness', type: 'int', default: '10' },
          { name: 'color', type: 'string', default: '#ffffff' },
          { name: 'feather', type: 'int', default: '40' },
        ],
      },
    ],
  },
  {
    label: 'Background Removal',
    endpoints: [
      { method: 'GET', path: '/bg-remove-overlay/status', description: 'Get model status' },
      { method: 'POST', path: '/bg-remove-overlay/remove/download', description: 'Download model (SSE)' },
      { method: 'POST', path: '/bg-remove-overlay/remove/load', description: 'Load model into memory' },
      { method: 'POST', path: '/bg-remove-overlay/remove/unload', description: 'Unload model from memory' },
      {
        method: 'POST', path: '/bg-remove-overlay/remove/set-device', description: 'Set processing device',
        params: [{ name: 'device', type: 'string', required: true, description: 'cuda | cpu' }],
      },
      { method: 'POST', path: '/bg-remove-overlay/remove/upload', description: 'Remove background from uploaded image (multipart)', params: [{ name: 'file', type: 'file', required: true }] },
      { method: 'POST', path: '/bg-remove-overlay/remove/url', description: 'Remove background from image URL', params: [{ name: 'url', type: 'string', required: true }] },
      { method: 'GET', path: '/bg-remove-overlay/remove/stream/{task_id}', description: 'Stream removal progress (SSE)' },
      { method: 'GET', path: '/bg-remove-overlay/remove/result/{task_id}', description: 'Get removal result' },
      { method: 'POST', path: '/bg-remove-overlay/video/upload', description: 'Remove background from video (multipart)' },
      { method: 'POST', path: '/bg-remove-overlay/video/url', description: 'Remove background from video URL' },
      { method: 'GET', path: '/bg-remove-overlay/video/stream/{task_id}', description: 'Stream video processing (SSE)' },
      { method: 'GET', path: '/bg-remove-overlay/video/result/{task_id}', description: 'Get video result' },
      { method: 'POST', path: '/bg-remove-overlay/remove/overlay', description: 'Overlay processed image on a background' },
      { method: 'POST', path: '/bg-remove-overlay/remove/overlay/upload', description: 'Overlay from uploaded fg + bg files (multipart)' },
      { method: 'POST', path: '/bg-remove-overlay/video/overlay', description: 'Video overlay (JSON)' },
      { method: 'POST', path: '/bg-remove-overlay/video/overlay/upload', description: 'Video overlay from uploaded files (multipart)' },
    ],
  },
  {
    label: 'Speech-to-Text (Whisper)',
    endpoints: [
      { method: 'GET', path: '/whisper/status', description: 'Get Whisper model status' },
      {
        method: 'POST', path: '/whisper/models/download', description: 'Download Whisper model (SSE)',
        params: [{ name: 'model', type: 'string', default: 'large-v3' }],
      },
      {
        method: 'POST', path: '/whisper/transcribe', description: 'Transcribe audio file (multipart)',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'model', type: 'string', default: 'large-v3' },
          { name: 'language', type: 'string', default: 'vi' },
          { name: 'add_punctuation', type: 'boolean', default: 'true' },
          { name: 'word_timestamps', type: 'boolean', default: 'false' },
          { name: 'script_text', type: 'string', description: 'Optional reference script for alignment' },
        ],
        returns: '{ task_id }',
        example: {
          request: `# multipart/form-data\nfile: audio.mp3\nmodel: large-v3\nlanguage: vi\nadd_punctuation: true`,
          response: `{ "task_id": "wsp_9f3a2b1c" }`,
        },
      },
      { method: 'GET', path: '/whisper/transcribe/stream/{task_id}', description: 'Stream transcription progress (SSE)' },
      { method: 'GET', path: '/whisper/transcribe/result/{task_id}', description: 'Get transcription result',
        example: { response: `{\n  "status": "done",\n  "segments": [\n    { "start": 0.0, "end": 3.2, "text": "Xin chào, đây là bản ghi âm." },\n    { "start": 3.5, "end": 6.1, "text": "Hệ thống nhận dạng giọng nói." }\n  ],\n  "full_text": "Xin chào, đây là bản ghi âm. Hệ thống nhận dạng giọng nói."\n}` } },
    ],
  },
  {
    label: 'Text-to-Speech — Edge TTS',
    endpoints: [
      { method: 'GET', path: '/edge-tts/languages', description: 'List supported languages' },
      { method: 'GET', path: '/edge-tts/voices', description: 'List voices, optionally filtered by language', params: [{ name: 'language', type: 'query string' }] },
      {
        method: 'POST', path: '/edge-tts/generate', description: 'Generate speech with Edge TTS',
        params: [
          { name: 'text', type: 'string', required: true },
          { name: 'voice', type: 'string', required: true },
          { name: 'rate', type: 'int', default: '0', description: 'Speed offset (%)' },
          { name: 'pitch', type: 'int', default: '0', description: 'Pitch offset (Hz)' },
        ],
        returns: '{ status, file_id, filename, download_url }',
        example: {
          request: `{\n  "text": "Xin chào, đây là giọng đọc tự động.",\n  "voice": "vi-VN-HoaiMyNeural",\n  "rate": 10,\n  "pitch": 0\n}`,
          response: `{\n  "status": "success",\n  "file_id": "tts_abc001",\n  "filename": "output.mp3",\n  "download_url": "/api/v1/files/tts_abc001"\n}`,
        },
      },
    ],
  },
  {
    label: 'Text-to-Speech — Piper TTS',
    endpoints: [
      { method: 'GET', path: '/piper-tts/model-status', description: 'Check Piper TTS installation status' },
      { method: 'POST', path: '/piper-tts/download-models', description: 'Download Piper TTS models (SSE)' },
      { method: 'GET', path: '/piper-tts/voices', description: 'List voices, optionally filtered by language', params: [{ name: 'language', type: 'query string' }] },
      { method: 'GET', path: '/piper-tts/demo/{filename}', description: 'Get demo audio file for a voice' },
      {
        method: 'POST', path: '/piper-tts/generate', description: 'Generate speech with Piper TTS',
        params: [
          { name: 'text', type: 'string', required: true },
          { name: 'voice_id', type: 'string', required: true },
          { name: 'language', type: 'string', default: 'vi' },
          { name: 'speed', type: 'float', default: '1.0' },
        ],
        example: {
          request: `{\n  "text": "Hôm nay thời tiết rất đẹp.",\n  "voice_id": "vi_vn_northern_female",\n  "language": "vi",\n  "speed": 1.0\n}`,
          response: `{\n  "status": "success",\n  "file_id": "pip_xyz123",\n  "download_url": "/api/v1/files/pip_xyz123"\n}`,
        },
      },
    ],
  },
  {
    label: 'Text-to-Speech — F5-TTS',
    note: 'Base URL: http://localhost:6902/api/v1',
    endpoints: [
      { method: 'GET', path: '/health', description: 'Health check (F5-TTS service)' },
      { method: 'GET', path: '/status', description: 'Service status and model info', returns: '{ status, uptime, models: { f5_tts, f5_tts_vn, f5_tts_en } }' },
      {
        method: 'POST', path: '/models/download', description: 'Download F5-TTS model (SSE)',
        params: [{ name: 'language', type: 'string', default: 'vi', description: 'vi | en' }],
      },
      { method: 'GET', path: '/voices', description: 'List voices', params: [{ name: 'language', type: 'query string', default: 'vi' }, { name: 'custom_only', type: 'query boolean', default: 'false' }] },
      {
        method: 'POST', path: '/voices/register', description: 'Register a custom cloned voice (multipart)',
        params: [
          { name: 'file', type: 'audio file', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'language', type: 'string', default: 'vi' },
          { name: 'transcript', type: 'string', required: true },
          { name: 'description', type: 'string', default: '' },
        ],
      },
      { method: 'GET', path: '/samples', description: 'List sample voices' },
      {
        method: 'POST', path: '/generate', description: 'Generate speech with F5-TTS (voice cloning)',
        params: [
          { name: 'voice_id', type: 'string', required: true },
          { name: 'text', type: 'string', required: true },
          { name: 'speed', type: 'float', default: '1.0' },
          { name: 'cfg_strength', type: 'float', default: '2.0' },
          { name: 'nfe_step', type: 'int', default: '32' },
          { name: 'remove_silence', type: 'boolean', default: 'false' },
          { name: 'language', type: 'string', default: 'vi' },
        ],
        returns: '{ task_id }',
        example: {
          request: `{\n  "voice_id": "custom_voice_001",\n  "text": "Đây là giọng nói được nhân bản bằng AI.",\n  "speed": 1.0,\n  "cfg_strength": 2.0,\n  "nfe_step": 32,\n  "remove_silence": true,\n  "language": "vi"\n}`,
          response: `{ "task_id": "f5_3c2b1a9d" }`,
        },
      },
      { method: 'GET', path: '/generate/stream/{task_id}', description: 'Stream generation progress (SSE)' },
      { method: 'GET', path: '/generate/download/{task_id}', description: 'Get download info after generation', returns: '{ status, filename, download_url }' },
    ],
  },
  {
    label: 'Translation',
    endpoints: [
      { method: 'GET', path: '/translation/status', description: 'Get m2m100 model status' },
      { method: 'POST', path: '/translation/download', description: 'Download translation model (SSE)' },
      { method: 'POST', path: '/translation/load', description: 'Load model into memory (SSE)' },
      { method: 'POST', path: '/translation/unload', description: 'Unload model from memory' },
      {
        method: 'POST', path: '/translation/translate', description: 'Translate text or segments',
        params: [
          { name: 'source_lang', type: 'string', required: true },
          { name: 'target_lang', type: 'string', required: true },
          { name: 'text', type: 'string', description: 'Plain text (mutually exclusive with segments)' },
          { name: 'segments', type: 'array', description: 'Timed segments (mutually exclusive with text)' },
          { name: 'preserve_emotion', type: 'boolean', default: 'true' },
        ],
        returns: '{ job_id }',
        example: {
          request: `{\n  "source_lang": "vi",\n  "target_lang": "en",\n  "text": "Xin chào thế giới. Hôm nay trời đẹp.",\n  "preserve_emotion": true\n}`,
          response: `{ "job_id": "trans_7f4d2e1b" }`,
        },
      },
      { method: 'GET', path: '/translation/translate/stream/{job_id}', description: 'Stream translation progress (SSE)' },
      { method: 'GET', path: '/translation/translate/result/{job_id}', description: 'Get translation result' },
    ],
  },
  {
    label: 'LLM (Ollama)',
    endpoints: [
      { method: 'GET', path: '/llm/status', description: 'Check Ollama server and list available models' },
      { method: 'GET', path: '/llm/config', description: 'Get current Ollama config', returns: '{ url, model }' },
      { method: 'PUT', path: '/llm/config', description: 'Update Ollama config', params: [{ name: 'url', type: 'string' }, { name: 'model', type: 'string' }] },
      { method: 'GET', path: '/llm/prompts', description: 'Get saved prompt templates' },
      { method: 'PUT', path: '/llm/prompts', description: 'Save prompt templates', params: [{ name: 'body', type: 'array of prompt objects', required: true }] },
      {
        method: 'POST', path: '/llm/generate', description: 'Generate text from Ollama',
        params: [
          { name: 'prompt', type: 'string', required: true },
          { name: 'input_text', type: 'string', required: true },
          { name: 'model', type: 'string' },
        ],
        example: {
          request: `{\n  "prompt": "Tóm tắt đoạn văn bản sau thành 3 câu ngắn gọn:",\n  "input_text": "Trí tuệ nhân tạo đang thay đổi cách con người làm việc...",\n  "model": "llama3"\n}`,
          response: `{\n  "result": "AI đang thay đổi công việc của con người. Các mô hình ngôn ngữ lớn giúp tự động hóa nhiều tác vụ. Tương lai sẽ có sự cộng tác giữa người và máy."\n}`,
        },
      },
      {
        method: 'POST', path: '/llm/combine', description: 'Run multiple prompts in a single Ollama call',
        params: [
          { name: 'input_text', type: 'string', required: true },
          { name: 'prompts', type: 'array of { id, prompt }', required: true },
          { name: 'model', type: 'string' },
        ],
        example: {
          request: `{\n  "input_text": "ContentHub là nền tảng quản lý nội dung đa kênh.",\n  "prompts": [\n    { "id": "title", "prompt": "Viết tiêu đề hấp dẫn cho:" },\n    { "id": "summary", "prompt": "Tóm tắt ngắn gọn:" },\n    { "id": "hashtags", "prompt": "Tạo 5 hashtag phù hợp cho:" }\n  ],\n  "model": "llama3"\n}`,
          response: `{\n  "title": "ContentHub – Giải Pháp Quản Lý Nội Dung Toàn Diện",\n  "summary": "Nền tảng giúp tạo, tổ chức và phân phối nội dung đa kênh.",\n  "hashtags": "#ContentHub #QuanLyNoiDung #AI #Marketing #Digital"\n}`,
        },
      },
      {
        method: 'POST', path: '/llm/batch/preview', description: 'Preview batch prompt processing',
        params: [{ name: 'data', type: 'object {key: text}', required: true }, { name: 'prompt', type: 'string', required: true }],
      },
      {
        method: 'POST', path: '/llm/batch/generate', description: 'Run Ollama on each entry in a batch',
        params: [
          { name: 'data', type: 'object {key: text}', required: true },
          { name: 'prompt', type: 'string', required: true },
          { name: 'model', type: 'string' },
        ],
      },
      {
        method: 'POST', path: '/llm/batch/parse', description: 'Transform / reformat batch data',
        params: [{ name: 'data', type: 'object {key: text}', required: true }],
      },
    ],
  },
  {
    label: 'Text Normalization',
    endpoints: [
      {
        method: 'POST', path: '/text/normalize', description: 'Normalize text for TTS (numbers, abbreviations, etc.)',
        params: [
          { name: 'text', type: 'string', required: true },
          { name: 'language', type: 'string', default: 'vi' },
        ],
        example: {
          request: `{\n  "text": "Ngày 15/3/2025, doanh thu đạt 1.500.000đ, tăng 20% so với Q1.",\n  "language": "vi"\n}`,
          response: `{\n  "normalized": "Ngày mười lăm tháng ba năm hai nghìn không trăm hai mươi lăm, doanh thu đạt một triệu năm trăm nghìn đồng, tăng hai mươi phần trăm so với quý một."\n}`,
        },
      },
    ],
  },
  {
    label: 'Image Search',
    endpoints: [
      {
        method: 'POST', path: '/image-search/image-finder/search', description: 'Search for images matching a text query',
        params: [
          { name: 'text', type: 'string', required: true },
          { name: 'number_of_images', type: 'int', default: '5' },
          { name: 'target_words', type: 'int', default: '15' },
          { name: 'timeout_seconds', type: 'int', default: '60' },
          { name: 'sources', type: 'array' },
          { name: 'use_llm', type: 'boolean', default: 'true' },
        ],
        example: {
          request: `{\n  "text": "cảnh hoàng hôn trên biển Việt Nam",\n  "number_of_images": 5,\n  "use_llm": true\n}`,
          response: `{\n  "images": [\n    { "url": "https://example.com/img1.jpg", "title": "Hoàng hôn Phú Quốc", "source": "unsplash" },\n    { "url": "https://example.com/img2.jpg", "title": "Sunset Đà Nẵng", "source": "pexels" }\n  ]\n}`,
        },
      },
      {
        method: 'POST', path: '/image-search/image-finder/download-all', description: 'Batch download images by URL list',
        params: [{ name: 'urls', type: 'string[]', required: true }, { name: 'save_dir', type: 'string', required: true }],
      },
      { method: 'GET', path: '/image-search/image-finder/download-all/stream/{task_id}', description: 'Stream batch download progress (SSE)' },
      { method: 'GET', path: '/image-search/sources', description: 'List available image sources' },
      {
        method: 'POST', path: '/image-search/sources/{source_id}/search', description: 'Search a single image source',
        params: [
          { name: 'query', type: 'string', required: true },
          { name: 'max_results', type: 'int', default: '10' },
          { name: 'timeout_seconds', type: 'int', default: '30' },
        ],
      },
    ],
  },
  {
    label: 'News Scraper',
    endpoints: [
      { method: 'GET', path: '/news-scraper/sources', description: 'List available news sources' },
      {
        method: 'POST', path: '/news-scraper/fetch-urls', description: 'Fetch article URLs from a source',
        params: [
          { name: 'source', type: 'string', default: 'vnexpress' },
          { name: 'category_url', type: 'string' },
          { name: 'limit', type: 'int', default: '20' },
        ],
      },
      {
        method: 'POST', path: '/news-scraper/scrape', description: 'Scrape a single article by URL',
        params: [{ name: 'url', type: 'string', required: true }, { name: 'source', type: 'string' }],
        example: {
          request: `{\n  "url": "https://vnexpress.net/bai-viet-mau-4800000.html",\n  "source": "vnexpress"\n}`,
          response: `{\n  "title": "Tiêu đề bài báo",\n  "content": "Nội dung bài báo đầy đủ...",\n  "author": "Nguyễn Văn A",\n  "published_at": "2025-03-20T08:00:00",\n  "images": ["https://i1.vnexpress.net/img1.jpg"]\n}`,
        },
      },
      {
        method: 'POST', path: '/news-scraper/crawl/start', description: 'Start a batch crawl job',
        params: [
          { name: 'source', type: 'string', default: 'vnexpress' },
          { name: 'category_url', type: 'string' },
          { name: 'limit', type: 'int', default: '10' },
          { name: 'out_dir', type: 'string' },
        ],
      },
      { method: 'GET', path: '/news-scraper/crawl/stream/{job_id}', description: 'Stream crawl progress (SSE)' },
      { method: 'GET', path: '/news-scraper/crawl/result/{job_id}', description: 'Get crawl result' },
      { method: 'GET', path: '/news-scraper/crawl/download/{job_id}', description: 'Download crawl result as file' },
    ],
  },
  {
    label: 'News-to-Video',
    endpoints: [
      { method: 'GET', path: '/news-to-video/templates', description: 'List available video templates' },
      {
        method: 'POST', path: '/news-to-video/quick-generate', description: 'All-in-one: scrape → TTS → render video',
        params: [
          { name: 'url', type: 'string', description: 'Article URL (mutually exclusive with input_text)' },
          { name: 'input_text', type: 'string' },
          { name: 'processing_mode', type: 'string', required: true },
          { name: 'language', type: 'string', required: true },
          { name: 'title', type: 'string', required: true },
          { name: 'template_id', type: 'string', required: true },
          { name: 'voice_model', type: 'string', required: true },
          { name: 'voice_id', type: 'string', required: true },
          { name: 'render_profile', type: 'string', required: true, description: 'tiktok | youtube | …' },
          { name: 'background_music', type: 'string' },
          { name: 'background_music_volume', type: 'float' },
          { name: 'image_source', type: 'string' },
        ],
        returns: '{ task_id }',
        example: {
          request: `{\n  "url": "https://vnexpress.net/bai-viet-4800000.html",\n  "processing_mode": "full",\n  "language": "vi",\n  "title": "Tin tức hôm nay",\n  "template_id": "dff",\n  "voice_model": "piper-tts",\n  "voice_id": "vi_vn_northern_female",\n  "render_profile": "tiktok",\n  "background_music_volume": 0.3,\n  "image_source": "auto"\n}`,
          response: `{ "task_id": "ntv_5e6f7a8b" }`,
        },
      },
      { method: 'GET', path: '/news-to-video/quick-generate/stream/{task_id}', description: 'Stream quick-generate progress (SSE)' },
      { method: 'GET', path: '/news-to-video/quick-generate/result/{task_id}', description: 'Get quick-generate result' },
      {
        method: 'POST', path: '/news-to-video/batch', description: 'Batch render multiple videos',
        params: [
          { name: 'mode', type: 'string', required: true, description: 'url | text' },
          { name: 'items', type: 'array', required: true },
          { name: 'template_id', type: 'string', default: 'dff' },
          { name: 'voice_model', type: 'string', default: 'piper-tts' },
          { name: 'voice_id', type: 'string', required: true },
          { name: 'render_profile', type: 'string', default: 'tiktok' },
          { name: 'background_music_volume', type: 'float', default: '0.36' },
        ],
      },
      { method: 'GET', path: '/news-to-video/batch/stream/{batch_id}', description: 'Stream batch progress (SSE)' },
      { method: 'GET', path: '/news-to-video/batch/result/{batch_id}', description: 'Get batch result' },
      { method: 'POST', path: '/news-to-video/render', description: 'Render video from uploaded assets (multipart)' },
      { method: 'POST', path: '/news-to-video/render-from-config', description: 'Render video from JSON config (no upload)' },
      { method: 'GET', path: '/news-to-video/render/stream/{task_id}', description: 'Stream render progress (SSE)' },
      { method: 'GET', path: '/news-to-video/render/result/{task_id}', description: 'Get render result' },
      { method: 'GET', path: '/news-to-video/setup/status', description: 'Get Remotion setup status' },
    ],
  },
  {
    label: 'Karaoke',
    endpoints: [
      { method: 'POST', path: '/karaoke/models/download', description: 'Download Demucs stem-separation model (SSE)' },
      {
        method: 'POST', path: '/karaoke/separate', description: 'Separate audio into stems',
        params: [
          { name: 'file', type: 'file', required: true },
          { name: 'separation_mode', type: 'string', default: 'mdx', description: 'demucs | mdx | ensemble' },
        ],
      },
      {
        method: 'POST', path: '/karaoke/render', description: 'Render karaoke video (multipart)',
        params: [
          { name: 'video_file_id / video_file', type: 'string / file' },
          { name: 'music_file_id / music_file', type: 'string / file' },
          { name: 'karaoke_json', type: 'string', required: true },
          { name: 'use_gpu', type: 'boolean', default: 'true' },
        ],
      },
      { method: 'GET', path: '/karaoke/stream/{task_id}', description: 'Stream karaoke render progress (SSE)' },
      { method: 'GET', path: '/karaoke/result/{task_id}', description: 'Get render result' },
      {
        method: 'POST', path: '/karaoke/render-remotion', description: 'Render karaoke with Remotion',
        params: [
          { name: 'music_file_id', type: 'string', required: true },
          { name: 'karaoke_json', type: 'string', required: true },
          { name: 'render_profile', type: 'string', default: 'tiktok' },
        ],
      },
      { method: 'POST', path: '/karaoke/batch', description: 'Start batch karaoke processing', params: [{ name: 'items', type: 'array', required: true }, { name: 'separation_mode', type: 'string', default: 'mdx' }, { name: 'language', type: 'string', default: 'vi' }] },
      { method: 'GET', path: '/karaoke/batch/stream/{batch_id}', description: 'Stream batch progress (SSE)' },
      { method: 'GET', path: '/karaoke/batch/result/{batch_id}', description: 'Get batch result' },
    ],
  },
  {
    label: 'Music Playlist Video',
    endpoints: [
      { method: 'GET', path: '/music-playlist/config', description: 'Get playlist video config' },
      { method: 'POST', path: '/music-playlist/config', description: 'Save playlist video config', params: [{ name: 'config', type: 'object', required: true }] },
      { method: 'GET', path: '/music-playlist/audio-files', description: 'List audio files in folder', params: [{ name: 'folder_path', type: 'query string', required: true }] },
      { method: 'POST', path: '/music-playlist/render', description: 'Render playlist video', params: [{ name: 'config', type: 'object', required: true }, { name: 'render_profile', type: 'string', default: 'tiktok' }] },
      { method: 'GET', path: '/music-playlist/render/stream/{task_id}', description: 'Stream render progress (SSE)' },
      { method: 'GET', path: '/music-playlist/render/result/{task_id}', description: 'Get render result' },
    ],
  },
  {
    label: 'Thumbnail Batch',
    endpoints: [
      {
        method: 'POST', path: '/thumbnail/batch', description: 'Generate thumbnails from a template + data rows',
        params: [
          { name: 'template', type: 'object', required: true },
          { name: 'rows', type: 'array', required: true },
          { name: 'label_column', type: 'string' },
        ],
        example: {
          request: `{\n  "template": {\n    "background": "#1b1b1b",\n    "width": 1280,\n    "height": 720,\n    "font": "bold 64px Arial",\n    "text_color": "#ffffff"\n  },\n  "rows": [\n    { "title": "Tin tức công nghệ", "image": "/path/to/img1.jpg" },\n    { "title": "Kinh tế hôm nay", "image": "/path/to/img2.jpg" }\n  ],\n  "label_column": "title"\n}`,
          response: `{\n  "job_id": "thumb_9a1b2c3d",\n  "total": 2\n}`,
        },
      },
      { method: 'GET', path: '/thumbnail/batch/stream/{job_id}', description: 'Stream generation progress (SSE)' },
      { method: 'GET', path: '/thumbnail/batch/status/{job_id}', description: 'Poll generation status' },
    ],
  },
  {
    label: 'Models & Tools',
    endpoints: [
      { method: 'GET', path: '/models/status', description: 'Get all model download statuses' },
      { method: 'GET', path: '/models/{model_key}/status', description: 'Get specific model status' },
      { method: 'POST', path: '/models/{model_key}/download', description: 'Download a model (SSE)' },
      { method: 'GET', path: '/tools/status', description: 'Get tools installation status (ffmpeg, etc.)' },
      { method: 'POST', path: '/tools/install', description: 'Install a tool (SSE)', params: [{ name: 'id', type: 'string', required: true }] },
      { method: 'GET', path: '/env/status', description: 'Get Python environment status' },
      { method: 'POST', path: '/env/install', description: 'Install Python packages', params: [{ name: 'packages', type: 'string[]' }] },
    ],
  },
];

/* ─── Sub-components ─────────────────────────────────── */
const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  POST: 'bg-green-500/15 text-green-400 border-green-500/30',
  PUT: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black tracking-widest uppercase border rounded-sm w-14 justify-center shrink-0 ${METHOD_COLORS[method]}`}>
      {method}
    </span>
  );
}

type UiLang = typeof ui['en'];

function EndpointRow({ ep, baseNote, uiLang }: { ep: Endpoint; baseNote?: string; uiLang: UiLang }) {
  const [open, setOpen] = useState(false);
  const hasDetail = (ep.params && ep.params.length > 0) || ep.returns || ep.note || ep.example;

  return (
    <div className="border border-[#2a2a2a] rounded-sm overflow-hidden">
      <button
        onClick={() => hasDetail && setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${hasDetail ? 'hover:bg-[#1a1a1a] cursor-pointer' : 'cursor-default'} bg-[#111111]`}
      >
        <MethodBadge method={ep.method} />
        <code className="text-[#ffa31a] text-xs font-mono flex-1 truncate">{ep.path}</code>
        <span className="text-[#606060] text-xs hidden sm:block flex-1 text-right truncate">{ep.description}</span>
        {hasDetail && (
          open
            ? <ChevronDown className="w-3.5 h-3.5 text-[#606060] shrink-0" />
            : <ChevronRight className="w-3.5 h-3.5 text-[#606060] shrink-0" />
        )}
      </button>

      {open && hasDetail && (
        <div className="border-t border-[#2a2a2a] bg-[#0d0d0d] px-4 py-4 space-y-3">
          <p className="text-[#808080] text-sm">{ep.description}</p>

          {baseNote && (
            <p className="text-[#ffa31a]/70 text-xs font-mono">{baseNote}</p>
          )}

          {ep.params && ep.params.length > 0 && (
            <div>
              <p className="text-[#606060] text-[11px] uppercase tracking-widest mb-2 font-bold">{uiLang.params}</p>
              <div className="space-y-1">
                {ep.params.map(p => (
                  <div key={p.name} className="flex items-start gap-3 text-xs">
                    <code className="text-white/80 font-mono w-36 shrink-0">{p.name}</code>
                    <span className="text-[#606060] w-28 shrink-0">{p.type}{p.required ? <span className="text-red-400 ml-1">*</span> : ''}</span>
                    <span className="text-[#505050]">
                      {p.default && <span className="text-[#ffa31a]/60 mr-2">default: {p.default}</span>}
                      {p.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ep.returns && (
            <div>
              <p className="text-[#606060] text-[11px] uppercase tracking-widest mb-1 font-bold">{uiLang.returns}</p>
              <code className="text-green-400/80 text-xs font-mono">{ep.returns}</code>
            </div>
          )}

          {ep.example && (
            <div className="space-y-2">
              <p className="text-[#606060] text-[11px] uppercase tracking-widest font-bold">{uiLang.example}</p>
              {ep.example.request && (
                <div>
                  <p className="text-[#505050] text-[10px] uppercase tracking-widest mb-1">{uiLang.exRequest}</p>
                  <pre className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm p-3 text-xs font-mono text-[#ffa31a]/80 overflow-x-auto whitespace-pre-wrap">{ep.example.request}</pre>
                </div>
              )}
              {ep.example.response && (
                <div>
                  <p className="text-[#505050] text-[10px] uppercase tracking-widest mb-1">{uiLang.exResponse}</p>
                  <pre className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm p-3 text-xs font-mono text-green-400/80 overflow-x-auto whitespace-pre-wrap">{ep.example.response}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GroupSection({ group, uiLang }: { group: Group; uiLang: UiLang }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#222222] rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#111111] hover:bg-[#161616] transition-colors duration-150 text-left"
      >
        <div className="flex items-center gap-3">
          {open
            ? <ChevronDown className="w-4 h-4 text-[#ffa31a]" />
            : <ChevronRight className="w-4 h-4 text-[#ffa31a]" />}
          <span className="text-white font-bold text-sm tracking-wide">{group.label}</span>
          <span className="text-[#505050] text-xs">{group.endpoints.length} {uiLang.endpoints}</span>
        </div>
        {group.note && (
          <span className="text-[#ffa31a]/50 text-[10px] font-mono hidden md:block">{group.note}</span>
        )}
      </button>

      {open && (
        <div className="border-t border-[#222222] p-3 space-y-1.5">
          {group.endpoints.map((ep, i) => (
            <EndpointRow key={i} ep={ep} baseNote={group.note} uiLang={uiLang} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── i18n ───────────────────────────────────────────── */
const groupLabelsVi: Record<string, string> = {
  'System': 'Hệ Thống',
  'Video Processing': 'Xử Lý Video',
  'Audio Processing': 'Xử Lý Âm Thanh',
  'Image Processing': 'Xử Lý Hình Ảnh',
  'Background Removal': 'Xóa Nền',
  'Speech-to-Text (Whisper)': 'Nhận Dạng Giọng Nói (Whisper)',
  'Text-to-Speech — Edge TTS': 'Chuyển Văn Bản Thành Giọng Nói — Edge TTS',
  'Text-to-Speech — Piper TTS': 'Chuyển Văn Bản Thành Giọng Nói — Piper TTS',
  'Text-to-Speech — F5-TTS': 'Chuyển Văn Bản Thành Giọng Nói — F5-TTS',
  'Translation': 'Dịch Thuật',
  'LLM (Ollama)': 'Mô Hình Ngôn Ngữ (Ollama)',
  'Text Normalization': 'Chuẩn Hóa Văn Bản',
  'Image Search': 'Tìm Kiếm Hình Ảnh',
  'News Scraper': 'Thu Thập Tin Tức',
  'News-to-Video': 'Tin Tức Thành Video',
  'Karaoke': 'Karaoke',
  'Music Playlist Video': 'Video Danh Sách Nhạc',
  'Thumbnail Batch': 'Tạo Thumbnail Hàng Loạt',
  'Models & Tools': 'Mô Hình & Công Cụ',
};

const ui = {
  en: {
    badge: 'API Reference',
    desc: 'REST API powering ContentHub — video/audio processing, AI speech, translation, image tools, and automated content pipeline. All async operations return a',
    descSuffix: 'and expose an SSE stream endpoint.',
    meta: (cats: number, eps: number) => `${cats} categories · ${eps} endpoints · click an endpoint to expand parameters`,
    params: 'Parameters',
    returns: 'Returns',
    errorTitle: 'Common Error Codes',
    errors: [
      ['400', 'Bad request / validation'],
      ['404', 'File or job not found'],
      ['503', 'Model not loaded / Ollama offline'],
      ['500', 'Internal server error'],
    ] as [string, string][],
    endpoints: 'endpoints',
    example: 'Example',
    exRequest: 'Request',
    exResponse: 'Response',
  },
  vi: {
    badge: 'Tài Liệu API',
    desc: 'REST API cho ContentHub — xử lý video/âm thanh, giọng nói AI, dịch thuật, công cụ hình ảnh và pipeline tạo nội dung tự động. Tất cả tác vụ bất đồng bộ trả về',
    descSuffix: 'và cung cấp endpoint SSE để theo dõi tiến trình.',
    meta: (cats: number, eps: number) => `${cats} nhóm chức năng · ${eps} endpoint · nhấn vào endpoint để xem tham số`,
    params: 'Tham Số',
    returns: 'Kết Quả Trả Về',
    errorTitle: 'Mã Lỗi Thường Gặp',
    errors: [
      ['400', 'Yêu cầu không hợp lệ / lỗi xác thực'],
      ['404', 'Không tìm thấy file hoặc job'],
      ['503', 'Mô hình chưa được tải / Ollama ngoại tuyến'],
      ['500', 'Lỗi máy chủ nội bộ'],
    ] as [string, string][],
    endpoints: 'endpoint',
    example: 'Ví Dụ',
    exRequest: 'Yêu Cầu',
    exResponse: 'Phản Hồi',
  },
};

/* ─── Main Section ───────────────────────────────────── */
export function ApiDocs({ lang = 'en' }: { lang?: 'en' | 'vi' }) {
  const totalEndpoints = groups.reduce((s, g) => s + g.endpoints.length, 0);
  const t = ui[lang];

  return (
    <section id="api-docs" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#141414] border-t border-[#222222]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="h-1 w-16 bg-[#ffa31a] mb-6" />
          <div className="flex items-center gap-4 mb-4">
            <PhLogo prefix="Content" suffix="Hub" size="lg" />
            <span className="text-[#606060] text-sm border border-[#333] px-3 py-1 rounded-sm font-mono">{t.badge}</span>
          </div>
          <p className="text-[#808080] text-base leading-relaxed max-w-2xl mb-6">
            {t.desc} <code className="text-[#ffa31a] bg-[#ffa31a]/10 px-1 rounded">task_id</code> {t.descSuffix}
          </p>

          {/* Base URLs */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 bg-[#111111] border border-[#2a2a2a] rounded-sm px-4 py-2">
              <span className="text-[#606060] text-[10px] uppercase tracking-widest font-bold">Main API</span>
              <code className="text-[#ffa31a] text-xs font-mono">{BASE_URLS.main}</code>
            </div>
            <div className="flex items-center gap-2 bg-[#111111] border border-[#2a2a2a] rounded-sm px-4 py-2">
              <span className="text-[#606060] text-[10px] uppercase tracking-widest font-bold">F5-TTS</span>
              <code className="text-[#ffa31a] text-xs font-mono">{BASE_URLS.tts}</code>
            </div>
          </div>

          <p className="text-[#505050] text-xs">{t.meta(groups.length, totalEndpoints)}</p>
        </div>

        {/* Groups */}
        <div className="space-y-2">
          {groups.map((g) => {
            const label = lang === 'vi' ? (groupLabelsVi[g.label] ?? g.label) : g.label;
            return (
              <GroupSection key={g.label} group={{ ...g, label }} uiLang={t} />
            );
          })}
        </div>

        {/* Error codes */}
        <div className="mt-10 border border-[#222222] rounded-sm p-5 bg-[#111111]">
          <p className="text-[#606060] text-[11px] uppercase tracking-widest font-bold mb-3">{t.errorTitle}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {t.errors.map(([code, desc]) => (
              <div key={code} className="flex flex-col gap-1">
                <span className="text-red-400 font-mono font-bold">{code}</span>
                <span className="text-[#505050]">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
