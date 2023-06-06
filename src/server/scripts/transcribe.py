import os
import openai
import sys

openai.api_key = os.getenv("OPENAI_API_KEY")
source_name = sys.argv[1]
result_type = sys.argv[2]
audio_source = sys.argv[3]

if audio_source == "youtube": 
    audio_file_path = os.path.join(os.getcwd(), 'tmp', source_name + '.m4a')
elif audio_source == "audio":
    audio_file_path = os.path.join(os.getcwd(), 'tmp', source_name)

audio_file = open(audio_file_path, "rb")
transcript = openai.Audio.transcribe(
  file=audio_file,
  model="whisper-1",
  response_format=result_type,
#   prompt=(
#       'I am trying to transcribe this audio'
#   )
)

# transcript = "In this video, I'm going to talk about different types of stop signs. The first thing you want to know when approaching a stop sign is what kind of a stop sign it is. Remember, driving is all about clarity. The more clear you are about the rules of the road, the better driver you become. Therefore, knowing what kind of a stop sign you're approaching helps you make a better decision. With the help of this video, you'll be able to tell from far what kind of a stop sign you're approaching. So there are two types of stop signs, two-way and four-way. A two-way stop sign means there is a stop sign only in two directions, that is, on your side and on the opposite side. The traffic on the left and right does not have a stop sign. So you need to yield right away to the traffic on your left and right and proceed with caution when the road is clear. A four-way stop sign means there is a stop sign in all the four directions. And whoever comes first at a four-way stop sign goes first. First comes, first goes. Simple. If two vehicles arrive at the same time, then the vehicle on the right has to right away. It is very easy to tell the difference between a two-way and a four-way stop sign. A two-way stop sign looks like this. And a four-way stop sign looks like this. So the difference between both of them is a white rectangular metal plate underneath the stop sign with all-way written on it. So the stop sign that has a rectangular plate underneath it is a four-way stop sign. Now I'm sure you can tell from far what kind of a stop sign you're approaching. I've been following this strategy for a long time and I've never had any confusions at stop signs. Sometimes you may miss the sign on your side and stop ahead of it. There's no need to worry. You don't need to look for signs in all the directions to see what kind of a stop sign you're at. Just look at the sign on the opposite side. If the sign on the opposite side of the road has a rectangular plate underneath it, then it's a four-way stop sign. Else, it's a two-way. Now why is it important for you to know the difference between both the stop signs? That is because your next move is based on that. At a two-way stop sign, you need to be extra cautious because you need to yield the right of way to the traffic on your left and right. Whereas at a four-way stop sign, whoever comes first goes first. I've seen a lot of people make a mistake of treating a two-way stop sign as a four-way stop sign and proceeding right after the stop without looking left and right and getting honked at or almost getting into collisions. You could avoid such situations by knowing better. So now that you know the difference between two kinds of stop signs, I hope you'll drive with better clarity. Take care and drive safe."
print(transcript, flush=True)

 