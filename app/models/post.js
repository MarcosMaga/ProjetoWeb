const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertPost = async(data) => {
    return await prisma.post.create({
        data,
        select: {
            receiver: true
        }
    })
}

const updatePost = async(id, data) => {
    return await prisma.post.update({
        where: {
            id: id
        },
        data: data
    })
}

const deletePost = async(id) => {
    return await prisma.post.delete({
        where: {
            id: id
        }
    })
}

const getPostById = async(id) => {
    return await prisma.post.findUnique({
        where: {
            id: id
        },
        include: {
            likes: {
                include: {
                    user: true
                }
            }

        }
    })
}

const getPostApprovedByUser = async (id, page, pageSize) => {
    const posts = await prisma.post.findMany({
        where: {
            approved: true,
            receiverId: id
        },
        orderBy: {
            createdOn: 'desc'
        },
        include: {
            creator: true,
            receiver: true,
            likes: true,
            comments: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    const postCount = await prisma.post.count({
        where: {
            receiverId: id,
            approved: true
        }
    });

    posts.count = postCount;

    return posts;
}

const getPostToFeedUser = async(userId, page, pageSize) => {
    const followingUser = await prisma.follow.findMany({
        where: {
            followerId: userId
        }
    })

    const postByFollowed = await prisma.post.findMany({
        where: {
            OR: [
                {creatorId: {in: followingUser.map(following => following.followingId)}},
                {receiverId: {in: followingUser.map(following => following.followingId)}}
            ],
            AND: [
                {approved: true}
            ]
        },
        orderBy: {
            createdOn: 'desc'
        },
        include: {
            creator: true,
            receiver: true,
            likes: true,
            comments: true,
        },
        skip: page,
        take: pageSize
    })

    return postByFollowed;
}

const getOtherPost = async(userId, page, pageSize) =>{
    const followingUser = await prisma.follow.findMany({
        where: {
            followerId: userId
        }
    })

    const postLikedId = await prisma.like.findMany({
        where: {
            userId: {in: followingUser.map(following => following.followingId)}
        },
        skip: page,
        take: pageSize
    })

    const postLiked = await prisma.post.findMany({
        where: {
            id: {in: postLikedId.map(post => post.id)}
        },
        orderBy: {
            createdOn: 'desc'
        },
        include: {
            creator: true,
            receiver: true,
            likes: true,
            comments: true,
        },
        skip: page,
        take: pageSize
    })

    const postCommentedId = await prisma.comment.findMany({
        where: {
            commentatorId: {in: followingUser.map(following => following.followingId)}
        },
        skip: page,
        take: pageSize
    })

    const postCommented = await prisma.post.findMany({
        where: {
            id: {in: postCommentedId.map(post => post.id)}
        },
        orderBy: {
            createdOn: 'desc'
        },
        include: {
            creator: true,
            receiver: true,
            likes: true,
            comments: true,
        },
        skip: page,
        take: pageSize
    })

    postCommented.forEach(post, index => {
        postCommented[index].message = `Publicação curtida por alguém que você segue.`;
    })
    
    postLiked.forEach(post, index => {
        postCommented[index].message = `Publicação comentada por alguém que você segue.`;
    })

    let finalPost = postLiked.concat(postCommented);
    finalPost = finalPost.sort(() => Math.random() - 0.5);
    return finalPost;
}

const getPostsNotApprovedByUser = async(id) => {
    return await prisma.post.findMany({
        where: {
            approved: false,
            receiverId: id
        },
        include: {
            creator: true
        }
    })
}

const getPostsNotViwedByUser = async(id) => {
    return await prisma.post.findMany({
        where:{
            viewed: false,
            receiverId: id
        }
    })
}

module.exports = {insertPost, updatePost, deletePost, getPostById, getPostToFeedUser, getOtherPost, getPostApprovedByUser, getPostsNotApprovedByUser, getPostsNotViwedByUser};