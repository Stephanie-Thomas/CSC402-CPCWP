# Frontend Documentation

  

## Overview

The Home page consists of a few sections:

1. Stats cards

2. Team Members

3. News Blocks

4. Leaderboard

  

## Structure

The page is located at `client/src/pages/home.tsx` and uses the following data structures:

  

```typescript

interface  TeamMember {

name: string;

role: string;

image: string;

}

  

interface  NewsBlock {

id: string;

title: string;

content: string;

date: string;

image?: string;

}

```

  

## How to Edit

  

### Team Members

To edit team members, locate the `teamMembers` array in `about.tsx`. Each member follows this format:

```typescript

{

name: "Member Name",

role: "Member Role",

image: "/team/member-image.jpg"

}

```

  

Add or remove members by modifying this array. Images should be placed in the `frontend/client/public/team` directory.

  

Be sure to double check that you have the proper image extension when defining the image name. Any will work, but it must match in the code

  

### News Blocks

News blocks are stored in the `initialNews` array. To add a new news item:

  

1. Add a new object to the array:

```typescript

{

id: "unique_id",

title: "News Title",

content: "News Content",

date: "YYYY-MM-DD",

image: "/news/image.jpg"

}

```

  

2. Place any news images in the `frontend/client/public/news` directory.

  
  

## Adding Images

1. Place team member images in: `frontend/client/public/team/`

2. Place news images in: `frontend/public/news/`

3. Use standard image formats (jpg, png, jpeg)

4. Recommended image sizes:

- Team members: Any Square formet, e.g. 256x256px

- News images: Anything 2:1 Aspect Ratio, e.g. 1200x600

  
  

## Additional Notes

- The Discord Icon on the home page navbar currently does not have a specific link
	- Navigate to `frontend/client/src/components/navbar.tsx`
	- Under the section labeled: {/* Right section, CPC Discord Link Here */}
		- locate the line `href="https://discord.gg"`
		- Replace the link with a custom link to the CPC Discord