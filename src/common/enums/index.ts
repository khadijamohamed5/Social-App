export enum SYS_ROLE{ 
    user,
    admin,
}

export enum SYS_GENDER {
    male, 
    female,
}

export enum SYS_PROVIDER {
    system,
    google
}

export enum SYS_REACTION { // 0 1 2 3 4 5
    like,
    love,
    haha,
    wow,
    sad,
    angry,
}

export enum ON_MODEL {
    Post = "Post",
    Comment = "Comment",
    Reel = "Reel",
    Story = "Story"
}

export enum SYS_USER_RELATION {
    son = "son",
    sister = "sister",
    brother = "brother",
    father = "father",
    mother = "mother",
}

export enum CHAT_TYPE {
    private = "private",
    group = "group"
}