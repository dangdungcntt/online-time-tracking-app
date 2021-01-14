const API_KEY = localStorage.getItem("API_KEY");
const SELECTED_DEVICE_ID = localStorage.getItem("SELECTED_DEVICE_ID");
const APP_URL =
    process.env.API_URL || "https://online-time-tracking.nddapp.com";
const RECORD_INTERVAL = process.env.RECORD_INTERVAL || 60;

const axios = require("axios");
const Api = axios.create({
    baseURL: `${APP_URL}/api`,
});

const app = new Vue({
    el: "#app",
    data() {
        return {
            loading: false,
            error: null,
            apiKey: API_KEY,
            isValidApiKey: false,
            user: null,
            permissions: [],

            //Devices
            newDeviceName: "",
            createDeviceError: null,
            devices: [],
            selectedDeviceId: SELECTED_DEVICE_ID,

            //record
            timerInterval: null,
        };
    },
    created() {
        this.submitApiKey();
    },
    watch: {
        selectedDeviceId(newValue) {
            localStorage.setItem("SELECTED_DEVICE_ID", newValue);
        },
    },
    computed: {
        showFormCreateDevice() {
            return this.permissions.includes("device:create");
        },
    },
    methods: {
        async submitApiKey() {
            await this.fetchApiKeyInfo();
            if (!this.isValidApiKey) {
                return;
            }
            await this.fetchDevices();

            if (this.selectedDeviceId) {
                this.record();
                this.timerInterval = setInterval(() => {
                    this.record();
                }, RECORD_INTERVAL * 1000);
            } else {
                clearInterval(this.timerInterval);
            }
        },
        async fetchApiKeyInfo() {
            if (!this.apiKey) {
                return;
            }

            this.loading = true;
            this.error = null;
            try {
                let response = await Api.get("/me", {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                });
                localStorage.setItem("API_KEY", this.apiKey);
                this.user = response.data.user;
                this.permissions = response.data.permissions;
                this.isValidApiKey = true;
            } catch (err) {
                if (err.response) {
                    this.error =
                        err.response.data.message || "Có lỗi xuất hiện";
                } else {
                    this.error = "Có lỗi xuất hiện";
                }
                this.user = null;
                this.permissions = [];
                this.isValidApiKey = false;
            }
            this.loading = false;
        },

        async fetchDevices() {
            try {
                let response = await Api.get("/devices", {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                });

                this.devices = response.data.data;

                if (this.devices.length > 0) {
                    if (
                        !this.selectedDeviceId ||
                        this.devices.find(
                            (device) => device.id == this.selectedDeviceId
                        )
                    )
                        this.selectedDeviceId = this.devices[0].id;
                } else {
                    this.selectedDeviceId = null;
                }
            } catch (err) {}
        },

        async createNewDevice() {},

        async record() {
            try {
                await Api.post(
                    `/devices/${this.selectedDeviceId}/records`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                        },
                    }
                );
            } catch (err) {}
        },
    },
});
