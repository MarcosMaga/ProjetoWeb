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
            },
            creator: true,
            receiver: true,
            comments: true
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
    const result = await prisma.post.findMany({
        where: {
          approved: true,
          OR: [
            {
              creatorId: {
                in: (await prisma.follow.findMany({
                  where: {
                    followerId: userId,
                  },
                  select: {
                    followingId: true,
                  },
                })).map((follow) => follow.followingId),
              },
            },
            {
              receiverId: {
                in: (await prisma.follow.findMany({
                  where: {
                    followerId: userId,
                  },
                  select: {
                    followingId: true,
                  },
                })).map((follow) => follow.followingId),
              },
            },
            {
              id: {
                in: (await prisma.like.findMany({
                  where: {
                    userId: {
                      in: (await prisma.follow.findMany({
                        where: {
                          followerId: userId,
                        },
                        select: {
                          followingId: true,
                        },
                      })).map((follow) => follow.followingId),
                    },
                  },
                  select: {
                    postId: true,
                  },
                })).map((like) => like.postId),
              },
            },
            {
              id: {
                in: (await prisma.comment.findMany({
                  where: {
                    commentatorId: {
                      in: (await prisma.follow.findMany({
                        where: {
                          followerId: userId,
                        },
                        select: {
                          followingId: true,
                        },
                      })).map((follow) => follow.followingId),
                    },
                  },
                  select: {
                    postId: true,
                  },
                })).map((comment) => comment.postId),
              },
            },
          ],
        },
        orderBy: {
          createdOn: 'desc',
        },
        include: {
            receiver: true,
            creator: true,
            likes: {
              include: {
                  user: true
              }
            },
            comments: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      });
    
      return result;
}

const getPostsNotApprovedByUser = async(id) => {
    return await prisma.post.findMany({
        where: {
            approved: false,
            receiverId: id
        },
        include: {
            creator: true
        },
        orderBy: {
          createdOn: 'desc'
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

module.exports = {insertPost, updatePost, deletePost, getPostById, getPostToFeedUser, getPostApprovedByUser, getPostsNotApprovedByUser, getPostsNotViwedByUser};