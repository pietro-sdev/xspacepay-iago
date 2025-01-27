"use client";
import Image from "next/image";
import {PlaySquareIcon} from "lucide-react" 
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Fragment, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LogInForm from "@/app/login/_components/login-form";

const LoginPage = () => {
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  return (
    <Fragment>
      <div className="min-h-screen bg-background  flex items-center  overflow-hidden w-full">
        <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">
          <div
            className="basis-1/2 bg-primary w-full relative hidden xl:flex justify-center items-center bg-gradient-to-br
          from-purple-600 via-purple-400 to-purple-600
         "
          >
            <Image
              src={'/images/auth/line.png'}
              width={200}
              height={200}
              alt="image"
              className="absolute top-0 left-0 w-full h-full "
            />
            <div className="relative z-10 backdrop-blur bg-primary-foreground/40 py-14 px-16 2xl:py-[84px] 2xl:pl-[50px] 2xl:pr-[136px] rounded max-w-[640px]">
              <div>
                <Button
                  className="bg-transparent hover:bg-transparent h-fit w-fit p-0"
                  onClick={() => setOpenVideo(true)}
                >
                </Button>

                <div className="text-4xl leading-[50px] 2xl:text-6xl 2xl:leading-[72px] font-semibold mt-2.5">
                  <span className="text-default-700 dark:text-default-300 font-semibold ">
                    XSpacePay <br />
                    Pagamentos e assinaturas <br />
                  </span>
                  <span className="text-default-900 dark:text-default-50">
                    no telegram
                  </span>
                </div>
                <div className="mt-5 2xl:mt-8 text-default-900 dark:text-default-200  text-2xl font-medium">
                  De forma simples. <br />
                  E eficaz
                </div>
              </div>
            </div>
          </div>

          <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
            <div className="lg:w-[480px] ">
              <LogInForm />
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openVideo} >
        <DialogContent className="p-0">
          <Button
            size="icon"
            onClick={() => setOpenVideo(false)}
            className="absolute -top-4 -right-4 bg-default-900"
          >
            <X className="w-6 h-6" />
          </Button>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/8D6b3McyhhU?si=zGOlY311c21dR70j"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default LoginPage;
