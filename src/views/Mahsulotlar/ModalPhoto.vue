<template>
  <div class="modal fade" id="photoProduct">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>
            {{
              product?.category +
              " - " +
              product?.Products.articul +
              " - " +
              product?.Products.eni +
              (product?.Products.boyi
                ? " x " + product?.Products.boyi
                : " metr")
            }}
          </h4>
        </div>
        <div class="modal-body">
          <div class="row text-left">
            <div class="col-md-12">
              <form @submit.prevent="postPhoto()" id="form-photo">
                Yangi rasm yuklash
                <input type="file" class="form-control form-control-sm" file />
              </form>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div class="responsive-y" style="max-height: 50vh">
            <div class="row">
              <div class="col-md-12 text-left">Yuklangan rasmlar</div>
              <div class="col-md-12" v-if="!photos.length">
                <i class="fa fa-3x fa-file-image" />
              </div>
              <div class="col-md-4 my-1" v-for="item in photos" :key="item">
                <div class="photo-viewer">
                  <img
                    :src="url + item.file"
                    :alt="item.file"
                    data-toggle="modal"
                    data-target="#onePhotoProduct"
                    @click="photo = item"
                  />
                  <i
                    class="fa fa-2x fa-xmark text-danger"
                    @click="deletePhoto(item.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" form="form-photo">
            <i class="far fa-circle-check" />
          </button>
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="onePhotoProduct">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body w-75 mx-auto">
          <div class="photo-viewer">
            <img :src="url + photo.file" :alt="photo.file" v-if="photo" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  url,
  catchError,
  uploadedFiles,
  uploadFile,
  success,
  removeFile,
} from "@/components/Api/api";
import swal from "sweetalert";
export default {
  name: "ModalPhoto",
  props: ["product_photo"],
  emits: ["setloading"],
  data() {
    return {
      url,
      photos: [],
      photo: null,
    };
  },
  computed: {
    product() {
      return this.$props.product_photo;
    },
  },
  watch: {
    product(product) {
      this.getPhotos();
    },
  },
  created() {
    if (this.product) {
      this.getPhotos();
    }
  },
  methods: {
    postPhoto() {
      this.$emit("setloading", true);
      let photo = document.querySelector("[file]").files[0];
      let file = new FormData();
      file.append("file", photo);
      uploadFile(this.product.Products.articul, file)
        .then((Response) => {
          success().then(() => {
            document.querySelector("[file]").value = null;
            this.getPhotos();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getPhotos() {
      this.$emit("setloading", true);
      uploadedFiles(this.product.Products.articul, "product")
        .then((Response) => {
          this.photos = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    deletePhoto(file_id) {
      this.$emit("setloading", true);
      swal({
        icon: "warning",
        title: "Ushbu rasm o'chiriladi",
        closeOnEsc: false,
        closeOnClickOutside: false,
        dangerMode: true,
        buttons: {
          confirm: {
            visible: true,
            value: true,
            text: "Ok",
          },
          cancel: {
            visible: true,
            value: false,
            text: "Bekor qilish",
          },
        },
      }).then((value) => {
        if (value) {
          removeFile(file_id)
            .then((Response) => {
              success().then(() => {
                this.getPhotos();
              });
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        } else {
          this.$emit("setloading", false);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.photo-viewer {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(0, 0, 0, 0.3);
  transition: 0.3s;

  img {
    width: 100%;
    object-fit: contain;
  }

  .fa-xmark {
    position: absolute;
    top: 0;
    right: 0;

    &:hover {
      color: red !important;
    }
  }
}
.col-md-4 .photo-viewer:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px 5px rgb(0, 0, 0, 0.5);
}
</style>
