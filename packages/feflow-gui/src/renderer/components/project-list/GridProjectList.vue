<template>
    <div class="grid-projects">
    <div class="create">
        <i class="create-icon"></i>
    </div>
    <div class="project-item">
        <div class="project-screen">
            <img src="https://images.unsplash.com/photo-1572731683325-58e84acdee79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" />
        </div>
        <div class="project-info">
            <div class="project-name">
                NOW Live
            </div>
            <div class="project-path">
                /Users/lewischeng/code/tencent/ivweb/qqlive
            </div>
        </div>
    </div>
    <div class="project-item">
        <div class="project-screen">
            <img src="https://images.unsplash.com/photo-1572731683325-58e84acdee79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" />
        </div>
        <div class="project-info">
            <div class="project-name">
                NOW Live
            </div>
            <div class="project-path">
                /Users/lewischeng/code/tencent/ivweb/qqlive
            </div>
        </div>
    </div>
    <div class="project-item">
        <div class="project-screen">
            <img src="https://images.unsplash.com/photo-1572731683325-58e84acdee79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" />
        </div>
        <div class="project-info">
            <div class="project-name">
                NOW Live
            </div>
            <div class="project-path">
                /Users/lewischeng/code/tencent/ivweb/qqlive
            </div>
        </div>
    </div>
    <div class="project-item">
        <div class="project-screen">
            <img src="https://images.unsplash.com/photo-1572731683325-58e84acdee79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" />
        </div>
        <div class="project-info">
            <div class="project-name">
                NOW Live
            </div>
            <div class="project-path">
                /Users/lewischeng/code/tencent/ivweb/qqlive
            </div>
        </div>
    </div>
        <div class="project-item">
        <div class="project-screen">
            <img src="https://images.unsplash.com/photo-1572731683325-58e84acdee79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" />
        </div>
        <div class="project-info">
            <div class="project-name">
                NOW Live
            </div>
            <div class="project-path">
                /Users/lewischeng/code/tencent/ivweb/qqlive
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.grid-projects {
    display: flex;
    flex-wrap: wrap;
    height: 450px;
    overflow-y: scroll;
}
.grid-projects .create {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 240px;
    background: #F3F4F5;
    border-radius: 5px;
    margin-right: 20px;
    margin-bottom: 20px;
}
.grid-projects .create .create-icon {
    background: url(../../assets/create.png) no-repeat;
    width: 40px;
    height: 40px;
    display: inline-block;
}
.grid-projects .project-item {
    width: 180px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.10);
    margin-right: 20px;
    margin-bottom: 20px;
}
.grid-projects .project-item:nth-child(3n) {
    margin-right: 0;
}

.grid-projects .project-item .project-screen img {
    width: 180px;
    height: 140px;
    border-radius: 3px 3px 0 0;
    display: block;
}
.grid-projects .project-item .project-info {
    height: 100px;
    padding: 0 10px;
}
.grid-projects .project-item .project-name {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #333333;
    padding-top: 30px;
    height: 22px;
}
.grid-projects .project-item .project-path {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    line-height: 16px;
    word-wrap: break-word;
}
</style>