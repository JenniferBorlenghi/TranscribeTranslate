import os
import openai
import sys
import math
from pydub import AudioSegment

openai.api_key = os.getenv("OPENAI_API_KEY")
source_name = sys.argv[1]
result_type = sys.argv[2]
audio_source = sys.argv[3]

ten_minutes = 10*60*1000

if audio_source == "youtube": 
    audio_file_path = os.path.join(os.getcwd(), 'tmp', source_name + '.mp3')
elif audio_source == "audio":
    audio_file_path = os.path.join(os.getcwd(), 'tmp', source_name)
   

transcripts = []

def transcribe_audio(audio_path):
  audio_file = open(audio_path, "rb")
  transcript = openai.Audio.transcribe(
    file=audio_file,
    model="whisper-1",
    response_format=result_type,
  )
  return transcript

# first - get the audio duration
def get_audio_durantion(file_path):
  audio = AudioSegment.from_file(audio_file_path)
  duration_ms = len(audio)
  duration_divided_ten_min = duration_ms/ten_minutes
  round = math.ceil(duration_divided_ten_min)
  return round

song = AudioSegment.from_mp3(audio_file_path)
audio_divided_ten_minutes = get_audio_durantion(audio_file_path)

for i in range(audio_divided_ten_minutes):
  start_time = i * ten_minutes
  end_time = (i + 1) * ten_minutes
  chunk = song[start_time:end_time]
  chunk.export('temp_chunk.mp3', format='mp3')
  transcript_attempt = transcribe_audio('temp_chunk.mp3')
  os.remove('temp_chunk.mp3')
  transcripts.append(transcript_attempt)

# print(transcripts, flush=True)

for transcript in transcripts:
  print(transcript, flush=True)
# transcript="Hello. Hello. Hey. Hey. Oh, hi. Good morning. Good morning. What's up? Hey, how are you? Hey, how are you? Hi. Hi. Hi. Good morning."


