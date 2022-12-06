<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'bd-bottom', index1 == 0 ? 'bd-top' : '']"
              style="margin-left: 50px; margin-right: 50px"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="['vcenter', index2 == 0 ? '' : 'bd-top']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="getRoleById(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="deleteRole(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
              >删除</el-button
            >
            <el-button
              @click="showTreeDialog(scope.row)"
              type="warning"
              icon="el-icon-setting"
              size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRuleDialogClosed"
    >
      <el-form
        ref="addRuleFormRef"
        :model="addRuleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="alterRoleDialogVisible"
      width="50%"
      @close="alterRuleDialogClosed"
    >
      <el-form
        ref="alterRuleFormRef"
        :model="alterRuleForm"
        :rules="alterRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="alterRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="alterRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="treeDialogVisible" width="50%">
      <el-tree
        node-key="id"
        ref="treeRef"
        default-expand-all
        show-checkbox
        :data="treeList"
        :props="treeListProps"
        :default-checked-keys="defaultNodeId"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="treeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRoleDialogVisible: false,
      addRuleForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "角色描述不能为空", trigger: "blur" },
        ],
      },
      alterRoleDialogVisible: false,
      alterRuleForm: {
        roleName: "",
        roleDesc: "",
      },
      alterRoleFormRules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "角色描述不能为空", trigger: "blur" },
        ],
      },
      treeDialogVisible: false,
      treeList: [],
      treeListProps: {
        children: "children",
        label: "authName",
      },
      defaultNodeId: [],
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
    this.getTreeList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (!res) return;
      this.rolesList = res.data;
    },
    addRuleDialogClosed() {
      this.$refs.addRuleFormRef.resetFields();
    },
    addRule() {
      this.$refs.addRuleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRuleForm);
        if (!res) return;
        this.addRoleDialogVisible = false;
        this.$message.success("创建成功");
        this.getRolesList();
      });
    },
    async getRoleById(id) {
      this.alterRoleDialogVisible = true;
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (!res) return;
      this.alterRuleForm = res.data;
    },
    alterRule() {
      this.$refs.alterRuleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.alterRuleForm.roleId}`,
          this.alterRuleForm
        );
        if (!res) return;
        this.alterRoleDialogVisible = false;
        this.$message.success("修改成功");
        this.getRolesList();
      });
    },
    alterRuleDialogClosed() {
      this.$refs.addRuleFormRef.resetFields();
    },
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (!res) return;
      this.$message.success("删除成功");
      this.getRolesList();
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (!res) return;
      this.$message.success("操作成功");
      role.children = res.data;
    },
    async getTreeList() {
      const { data: res } = await this.$http.get("rights/tree");
      if (!res) return;
      this.treeList = res.data;
    },
    getDefaultNodeList(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach((item) => {
        this.getDefaultNodeList(item, arr);
      });
    },
    showTreeDialog(node) {
      this.roleId = node.id;
      this.getDefaultNodeList(node, this.defaultNodeId);
      console.log(this.defaultNodeId);
      this.treeDialogVisible = true;
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (!res) return;
      this.$message.success("编辑成功");
      this.treeDialogVisible = false;
      this.getRolesList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>