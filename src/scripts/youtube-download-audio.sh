#!/bin/sh

VIDEO_ID=$1

[ -z "$VIDEO_ID" ] && echo "ERROR: No video ID specified" && exit 1

yt-dlp "https://www.youtube.com/watch?v=$VIDEO_ID" --format mp3 -o "./tmp/%(id)s.%(ext)s" 2>&1