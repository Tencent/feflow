<template>
  <div class="side-bar">
    <ul class="nav">
      <li class="project current"><i class="icon" />我的项目</li>
      <li class="market"><i class="icon" />插件市场</li>
    </ul>
    <div class="account">
    <div class="personal-info">
        <div class="avatar">
        <img src="https://avatars1.githubusercontent.com/u/18289264?s=460&v=4" />
        </div>
        <div class="nickname">cpselvis</div>
    </div>
    <div class="logout" />
    </div>
  </div>
</template>

<style>
.side-bar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 160px;
    height: 600px;
    background: #434650;
}
.side-bar .nav {
    font-size: 14px;
    color: #bebebe;
    padding-top: 50px;
}
.side-bar .nav li {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
}

.side-bar .nav li.current {
    background: #8a92af;
    color: #fff;
}

.side-bar .nav .project .icon {
    background: url('../assets/project.png') no-repeat;
    width: 15px;
    height: 15px;
    display: inline-block;
    margin-right: 10px;
}

.side-bar .nav .market .icon {
    background: url('../assets/market.png') no-repeat;
    width: 15px;
    height: 15px;
    display: inline-block;
    margin-right: 10px;
}

.side-bar .account {
    width: 160px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
}

.side-bar .account .personal-info {
    height: 60px;
    margin-left: 12px;
    display: flex;
    align-items: center;
}

.side-bar .account .personal-info .avatar img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 8px;
}

.side-bar .account .logout {
    background: url('../assets/logout.png') no-repeat;
    width: 14px;
    height: 13px;
    display: inline-block;
    margin-right: 14px;
}
</style>